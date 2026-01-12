# Endless Events - Move Smart Contracts

## Overview

This directory contains the Move smart contracts for the Endless Events platform:

- **endless_events.move** - Event creation and management
- **ticket_nft.move** - NFT ticket minting and validation  
- **poap_nft.move** - Soulbound POAP badges for attendance proof

## Prerequisites

1. Install the Endless/Aptos CLI:
```bash
# For Aptos
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3

# For Endless (check their docs for latest)
# https://endless.link/docs/cli
```

2. Create a wallet and fund it:
```bash
aptos init
aptos account fund-with-faucet --account default
```

## Compile

```bash
cd move
aptos move compile
```

## Test

```bash
aptos move test
```

## Deploy

1. Set your address in `Move.toml`:
```toml
[addresses]
endless_events = "YOUR_WALLET_ADDRESS"
```

2. Publish to testnet:
```bash
aptos move publish --named-addresses endless_events=default
```

## Contract Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    EVENT MANAGER                             │
│  - create_event()                                           │
│  - cancel_event()                                           │
│  - get_event()                                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     TICKET NFT                               │
│  - mint_ticket() - One per wallet per event                 │
│  - check_in() - Marks ticket as used                        │
│  - get_tickets() - View user's tickets                      │
│  - NON-TRANSFERABLE (soulbound)                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ (after check-in)
┌─────────────────────────────────────────────────────────────┐
│                      POAP NFT                                │
│  - mint_poap() - Only after verified check-in               │
│  - get_poaps() - View user's POAPs                          │
│  - SOULBOUND - Absolutely non-transferable                  │
│  - Metadata: event, date, location, role                    │
└─────────────────────────────────────────────────────────────┘
```

## Key Features

### Soulbound Tokens
Both tickets and POAPs are **non-transferable**. This is enforced by:
- Not implementing any transfer functions
- Storing tokens directly in user accounts
- Recording owner address in token data

### One Ticket Per Wallet
The `mint_ticket` function checks if a user already has a ticket for the event and rejects duplicates.

### Attendance Verification
POAPs are only minted **after** a valid check-in, ensuring proof of actual attendance.

## Integration with Frontend

The React frontend calls these contracts via the Aptos/Endless SDK:

```typescript
import { AptosClient } from "aptos";

const client = new AptosClient("https://fullnode.testnet.aptoslabs.com");

// Example: Register for event
await client.submitTransaction(account, {
  function: `${MODULE_ADDRESS}::ticket_nft::mint_ticket`,
  type_arguments: [],
  arguments: [
    registry_address,
    event_id,
    event_name,
    // ... other params
  ],
});
```

## Security Considerations

1. **Access Control** - Only event hosts can check in attendees
2. **No Raw SQL** - All data access through Move resources
3. **Soulbound Enforcement** - No transfer capability = truly non-transferable
4. **Event Capacity** - On-chain enforcement of max attendees
