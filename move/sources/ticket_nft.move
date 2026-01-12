/// Endless Events - NFT Ticket Module
/// Non-transferable event tickets as NFTs
module endless_events::ticket_nft {
    use std::string::String;
    use std::signer;
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    /// Error codes
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_TICKET_NOT_FOUND: u64 = 2;
    const E_ALREADY_HAS_TICKET: u64 = 3;
    const E_TICKET_ALREADY_USED: u64 = 4;
    const E_EVENT_FULL: u64 = 5;
    const E_INSUFFICIENT_PAYMENT: u64 = 6;
    const E_TRANSFER_NOT_ALLOWED: u64 = 7;

    /// Ticket NFT structure (soulbound - non-transferable)
    struct TicketNFT has key, store {
        id: u64,
        event_id: u64,
        event_name: String,
        event_date: u64,
        event_location: String,
        owner: address,
        is_used: bool,
        check_in_time: u64,
        ticket_type: String, // "general", "vip", "speaker"
        metadata_uri: String,
    }

    /// User's ticket collection
    struct TicketCollection has key {
        tickets: vector<TicketNFT>,
    }

    /// Global ticket registry for tracking
    struct TicketRegistry has key {
        next_ticket_id: u64,
        event_ticket_counts: vector<EventTicketCount>,
        mint_events: event::EventHandle<TicketMintEvent>,
        checkin_events: event::EventHandle<CheckInEvent>,
    }

    struct EventTicketCount has store, copy, drop {
        event_id: u64,
        count: u64,
        max_tickets: u64,
    }

    /// Events
    struct TicketMintEvent has drop, store {
        ticket_id: u64,
        event_id: u64,
        owner: address,
        timestamp: u64,
    }

    struct CheckInEvent has drop, store {
        ticket_id: u64,
        event_id: u64,
        owner: address,
        timestamp: u64,
    }

    /// Initialize ticket registry
    public entry fun initialize(admin: &signer) {
        move_to(admin, TicketRegistry {
            next_ticket_id: 1,
            event_ticket_counts: vector::empty(),
            mint_events: account::new_event_handle<TicketMintEvent>(admin),
            checkin_events: account::new_event_handle<CheckInEvent>(admin),
        });
    }

    /// Mint a ticket for an attendee
    public entry fun mint_ticket(
        attendee: &signer,
        registry_addr: address,
        event_id: u64,
        event_name: String,
        event_date: u64,
        event_location: String,
        max_tickets: u64,
        ticket_price: u64,
        ticket_type: String,
        metadata_uri: String,
    ) acquires TicketRegistry, TicketCollection {
        let attendee_addr = signer::address_of(attendee);
        let registry = borrow_global_mut<TicketRegistry>(registry_addr);

        // Check if user already has a ticket for this event
        if (exists<TicketCollection>(attendee_addr)) {
            let collection = borrow_global<TicketCollection>(attendee_addr);
            let len = vector::length(&collection.tickets);
            let i = 0;
            while (i < len) {
                let ticket = vector::borrow(&collection.tickets, i);
                assert!(ticket.event_id != event_id, E_ALREADY_HAS_TICKET);
                i = i + 1;
            };
        };

        // Check event capacity
        let event_count = get_or_create_event_count(&mut registry.event_ticket_counts, event_id, max_tickets);
        assert!(event_count.count < event_count.max_tickets, E_EVENT_FULL);

        // Handle payment if ticket is not free
        if (ticket_price > 0) {
            // Transfer payment (in production, send to event host)
            coin::transfer<AptosCoin>(attendee, registry_addr, ticket_price);
        };

        // Create the ticket NFT
        let ticket_id = registry.next_ticket_id;
        registry.next_ticket_id = ticket_id + 1;

        let new_ticket = TicketNFT {
            id: ticket_id,
            event_id,
            event_name,
            event_date,
            event_location,
            owner: attendee_addr,
            is_used: false,
            check_in_time: 0,
            ticket_type,
            metadata_uri,
        };

        // Add to user's collection
        if (!exists<TicketCollection>(attendee_addr)) {
            move_to(attendee, TicketCollection {
                tickets: vector::empty(),
            });
        };
        
        let collection = borrow_global_mut<TicketCollection>(attendee_addr);
        vector::push_back(&mut collection.tickets, new_ticket);

        // Update event ticket count
        increment_event_count(&mut registry.event_ticket_counts, event_id);

        // Emit mint event
        event::emit_event(&mut registry.mint_events, TicketMintEvent {
            ticket_id,
            event_id,
            owner: attendee_addr,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Check in with a ticket (marks as used, called by event host)
    public entry fun check_in(
        host: &signer,
        registry_addr: address,
        attendee_addr: address,
        event_id: u64,
    ) acquires TicketRegistry, TicketCollection {
        let registry = borrow_global_mut<TicketRegistry>(registry_addr);
        let collection = borrow_global_mut<TicketCollection>(attendee_addr);
        
        let len = vector::length(&collection.tickets);
        let i = 0;
        
        while (i < len) {
            let ticket = vector::borrow_mut(&mut collection.tickets, i);
            if (ticket.event_id == event_id) {
                assert!(!ticket.is_used, E_TICKET_ALREADY_USED);
                ticket.is_used = true;
                ticket.check_in_time = timestamp::now_seconds();
                
                event::emit_event(&mut registry.checkin_events, CheckInEvent {
                    ticket_id: ticket.id,
                    event_id,
                    owner: attendee_addr,
                    timestamp: timestamp::now_seconds(),
                });
                return
            };
            i = i + 1;
        };
        
        abort E_TICKET_NOT_FOUND
    }

    /// Get user's tickets (view function)
    #[view]
    public fun get_tickets(owner: address): vector<TicketNFT> acquires TicketCollection {
        if (!exists<TicketCollection>(owner)) {
            return vector::empty()
        };
        let collection = borrow_global<TicketCollection>(owner);
        collection.tickets
    }

    /// Check if user has valid ticket for event
    #[view]
    public fun has_valid_ticket(owner: address, event_id: u64): bool acquires TicketCollection {
        if (!exists<TicketCollection>(owner)) {
            return false
        };
        let collection = borrow_global<TicketCollection>(owner);
        let len = vector::length(&collection.tickets);
        let i = 0;
        
        while (i < len) {
            let ticket = vector::borrow(&collection.tickets, i);
            if (ticket.event_id == event_id && !ticket.is_used) {
                return true
            };
            i = i + 1;
        };
        false
    }

    // Helper functions
    fun get_or_create_event_count(
        counts: &mut vector<EventTicketCount>,
        event_id: u64,
        max_tickets: u64
    ): &EventTicketCount {
        let len = vector::length(counts);
        let i = 0;
        
        while (i < len) {
            let count = vector::borrow(counts, i);
            if (count.event_id == event_id) {
                return count
            };
            i = i + 1;
        };
        
        // Create new count entry
        vector::push_back(counts, EventTicketCount {
            event_id,
            count: 0,
            max_tickets,
        });
        
        vector::borrow(counts, len)
    }

    fun increment_event_count(counts: &mut vector<EventTicketCount>, event_id: u64) {
        let len = vector::length(counts);
        let i = 0;
        
        while (i < len) {
            let count = vector::borrow_mut(counts, i);
            if (count.event_id == event_id) {
                count.count = count.count + 1;
                return
            };
            i = i + 1;
        };
    }
}
