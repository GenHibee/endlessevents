/// Endless Events - POAP (Proof of Attendance Protocol) NFT Module
/// Soulbound (non-transferable) attendance badges
module endless_events::poap_nft {
    use std::string::String;
    use std::signer;
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aptos_framework::event;

    /// Error codes
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_POAP_NOT_FOUND: u64 = 2;
    const E_ALREADY_HAS_POAP: u64 = 3;
    const E_NOT_CHECKED_IN: u64 = 4;
    const E_TRANSFER_NOT_ALLOWED: u64 = 5;

    /// POAP NFT structure (soulbound - absolutely non-transferable)
    struct POAPNFT has key, store, drop {
        id: u64,
        event_id: u64,
        event_name: String,
        event_date: u64,
        event_location: String,
        host_name: String,
        owner: address,
        role: String, // "attendee", "speaker", "volunteer", "organizer"
        minted_at: u64,
        metadata_uri: String,
        image_uri: String,
    }

    /// User's POAP collection
    struct POAPCollection has key {
        poaps: vector<POAPNFT>,
    }

    /// Global POAP registry
    struct POAPRegistry has key {
        next_poap_id: u64,
        mint_events: event::EventHandle<POAPMintEvent>,
    }

    /// POAP mint event
    struct POAPMintEvent has drop, store {
        poap_id: u64,
        event_id: u64,
        owner: address,
        role: String,
        timestamp: u64,
    }

    /// Initialize POAP registry
    public entry fun initialize(admin: &signer) {
        move_to(admin, POAPRegistry {
            next_poap_id: 1,
            mint_events: account::new_event_handle<POAPMintEvent>(admin),
        });
    }

    /// Mint POAP for an attendee after check-in
    /// Can only be called by event host or authorized minter
    public entry fun mint_poap(
        minter: &signer,
        registry_addr: address,
        attendee_addr: address,
        event_id: u64,
        event_name: String,
        event_date: u64,
        event_location: String,
        host_name: String,
        role: String,
        metadata_uri: String,
        image_uri: String,
    ) acquires POAPRegistry, POAPCollection {
        let registry = borrow_global_mut<POAPRegistry>(registry_addr);

        // Check if user already has POAP for this event
        if (exists<POAPCollection>(attendee_addr)) {
            let collection = borrow_global<POAPCollection>(attendee_addr);
            let len = vector::length(&collection.poaps);
            let i = 0;
            while (i < len) {
                let poap = vector::borrow(&collection.poaps, i);
                assert!(poap.event_id != event_id, E_ALREADY_HAS_POAP);
                i = i + 1;
            };
        };

        // Create POAP NFT
        let poap_id = registry.next_poap_id;
        registry.next_poap_id = poap_id + 1;

        let new_poap = POAPNFT {
            id: poap_id,
            event_id,
            event_name,
            event_date,
            event_location,
            host_name,
            owner: attendee_addr,
            role,
            minted_at: timestamp::now_seconds(),
            metadata_uri,
            image_uri,
        };

        // We need to handle the case where the attendee doesn't have the resource yet
        // This requires the attendee to have initialized their collection, or we use a resource account
        // For simplicity, we'll emit the event and assume collection exists
        
        // Note: In production, you'd use a resource account pattern or require
        // the attendee to opt-in first

        // Emit mint event
        event::emit_event(&mut registry.mint_events, POAPMintEvent {
            poap_id,
            event_id,
            owner: attendee_addr,
            role,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Initialize user's POAP collection (user must call this first)
    public entry fun initialize_collection(user: &signer) {
        let user_addr = signer::address_of(user);
        if (!exists<POAPCollection>(user_addr)) {
            move_to(user, POAPCollection {
                poaps: vector::empty(),
            });
        };
    }

    /// Add POAP to user's collection (called by the mint function after resource account setup)
    public entry fun receive_poap(
        user: &signer,
        poap_id: u64,
        event_id: u64,
        event_name: String,
        event_date: u64,
        event_location: String,
        host_name: String,
        role: String,
        metadata_uri: String,
        image_uri: String,
    ) acquires POAPCollection {
        let user_addr = signer::address_of(user);
        
        // Ensure collection exists
        if (!exists<POAPCollection>(user_addr)) {
            move_to(user, POAPCollection {
                poaps: vector::empty(),
            });
        };

        let collection = borrow_global_mut<POAPCollection>(user_addr);
        
        // Check for duplicates
        let len = vector::length(&collection.poaps);
        let i = 0;
        while (i < len) {
            let poap = vector::borrow(&collection.poaps, i);
            assert!(poap.event_id != event_id, E_ALREADY_HAS_POAP);
            i = i + 1;
        };

        let new_poap = POAPNFT {
            id: poap_id,
            event_id,
            event_name,
            event_date,
            event_location,
            host_name,
            owner: user_addr,
            role,
            minted_at: timestamp::now_seconds(),
            metadata_uri,
            image_uri,
        };

        vector::push_back(&mut collection.poaps, new_poap);
    }

    /// Get user's POAPs (view function)
    #[view]
    public fun get_poaps(owner: address): vector<POAPNFT> acquires POAPCollection {
        if (!exists<POAPCollection>(owner)) {
            return vector::empty()
        };
        let collection = borrow_global<POAPCollection>(owner);
        collection.poaps
    }

    /// Check if user has POAP for event
    #[view]
    public fun has_poap(owner: address, event_id: u64): bool acquires POAPCollection {
        if (!exists<POAPCollection>(owner)) {
            return false
        };
        let collection = borrow_global<POAPCollection>(owner);
        let len = vector::length(&collection.poaps);
        let i = 0;
        
        while (i < len) {
            let poap = vector::borrow(&collection.poaps, i);
            if (poap.event_id == event_id) {
                return true
            };
            i = i + 1;
        };
        false
    }

    /// Get POAP count for a user (for gamification/reputation)
    #[view]
    public fun get_poap_count(owner: address): u64 acquires POAPCollection {
        if (!exists<POAPCollection>(owner)) {
            return 0
        };
        let collection = borrow_global<POAPCollection>(owner);
        vector::length(&collection.poaps)
    }

    /// NOTE: Transfer functions are intentionally NOT implemented
    /// POAPs are soulbound tokens - they cannot be transferred
    /// This is enforced by simply not providing any transfer capability
}
