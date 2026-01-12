/// Endless Events - Main Event Management Module
/// Compile with: endless move compile
/// Deploy with: endless move publish
module endless_events::event_manager {
    use std::string::String;
    use std::signer;
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aptos_framework::event;

    /// Error codes
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_EVENT_NOT_FOUND: u64 = 2;
    const E_EVENT_FULL: u64 = 3;
    const E_ALREADY_REGISTERED: u64 = 4;
    const E_NOT_REGISTERED: u64 = 5;
    const E_ALREADY_CHECKED_IN: u64 = 6;
    const E_EVENT_NOT_STARTED: u64 = 7;

    /// Event data structure
    struct EventInfo has key, store, copy, drop {
        id: u64,
        name: String,
        description: String,
        location: String,
        start_time: u64,
        end_time: u64,
        max_attendees: u64,
        current_attendees: u64,
        host: address,
        is_free: bool,
        price: u64,
        poap_enabled: bool,
        is_active: bool,
    }

    /// Global event registry
    struct EventRegistry has key {
        events: vector<EventInfo>,
        next_event_id: u64,
        create_event_events: event::EventHandle<CreateEventEvent>,
    }

    /// Event creation event
    struct CreateEventEvent has drop, store {
        event_id: u64,
        host: address,
        name: String,
        timestamp: u64,
    }

    /// Initialize the event registry (called once by admin)
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        move_to(admin, EventRegistry {
            events: vector::empty(),
            next_event_id: 1,
            create_event_events: account::new_event_handle<CreateEventEvent>(admin),
        });
    }

    /// Create a new event
    public entry fun create_event(
        host: &signer,
        registry_addr: address,
        name: String,
        description: String,
        location: String,
        start_time: u64,
        end_time: u64,
        max_attendees: u64,
        is_free: bool,
        price: u64,
        poap_enabled: bool,
    ) acquires EventRegistry {
        let host_addr = signer::address_of(host);
        let registry = borrow_global_mut<EventRegistry>(registry_addr);
        
        let event_id = registry.next_event_id;
        registry.next_event_id = event_id + 1;

        let new_event = EventInfo {
            id: event_id,
            name,
            description,
            location,
            start_time,
            end_time,
            max_attendees,
            current_attendees: 0,
            host: host_addr,
            is_free,
            price,
            poap_enabled,
            is_active: true,
        };

        vector::push_back(&mut registry.events, new_event);

        event::emit_event(&mut registry.create_event_events, CreateEventEvent {
            event_id,
            host: host_addr,
            name,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Get event details (view function)
    #[view]
    public fun get_event(registry_addr: address, event_id: u64): EventInfo acquires EventRegistry {
        let registry = borrow_global<EventRegistry>(registry_addr);
        let len = vector::length(&registry.events);
        let i = 0;
        
        while (i < len) {
            let evt = vector::borrow(&registry.events, i);
            if (evt.id == event_id) {
                return *evt
            };
            i = i + 1;
        };
        
        abort E_EVENT_NOT_FOUND
    }

    /// Cancel an event (host only)
    public entry fun cancel_event(
        host: &signer,
        registry_addr: address,
        event_id: u64,
    ) acquires EventRegistry {
        let host_addr = signer::address_of(host);
        let registry = borrow_global_mut<EventRegistry>(registry_addr);
        let len = vector::length(&registry.events);
        let i = 0;
        
        while (i < len) {
            let evt = vector::borrow_mut(&mut registry.events, i);
            if (evt.id == event_id) {
                assert!(evt.host == host_addr, E_NOT_AUTHORIZED);
                evt.is_active = false;
                return
            };
            i = i + 1;
        };
        
        abort E_EVENT_NOT_FOUND
    }
}
