// Mock-first Coins data for the Leaderboard page.
// Flip USE_MOCK_COINS=false later to use the API.

type CoinRow = {
    address: string;
    name: string | null;
    symbol: string;
    handle: string;
    imageUrl?: string;
    flywheels: string[];
    holders: number;
    volume24h: number;
    pnl7d: number;
    lastActivated: string;
  };
  
  const USE_MOCK = process.env.USE_MOCK_COINS !== "false"; // default true
  const MOCK_COINS: CoinRow[] = [
    { address: "0x9cfa8a8b8c8d8e8f909192939495969798999a", name: "MOLLY", symbol: "$MOLLY", handle: "@ilovemolly4ever", imageUrl: "https://picsum.photos/seed/molly/200", flywheels: ["Airdrop", "RevShare"], holders: 8, volume24h: 12, pnl7d: 99.8, lastActivated: "Airdrop" },
    { address: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef", name: "BORED", symbol: "$BORED", handle: "@bored", imageUrl: "https://picsum.photos/seed/bored/200", flywheels: ["Buyback", "RevShare"], holders: 9, volume24h: 87, pnl7d: 99.5, lastActivated: "Buyback" },
    { address: "0x7f8e9d0c1b2a3948576e5d4c3b2a1908f7e6d5c", name: "DEFI", symbol: "$DEFI", handle: "@definitive", imageUrl: "https://picsum.photos/seed/defi/200", flywheels: ["Airdrop", "Buyback"], holders: 7, volume24h: 3, pnl7d: 99.2, lastActivated: "RevShare" },
    { address: "0x3c4d5e6f7890abcdef1234567890abcdef123456", name: "OXEN", symbol: "$OXEN", handle: "@Oxen", imageUrl: "https://picsum.photos/seed/oxen/200", flywheels: ["Airdrop", "Buyback", "RevShare"], holders: 6, volume24h: 94, pnl7d: 99.9, lastActivated: "Buyback" },
    { address: "0x5e6f7890abcdef1234567890abcdef1234567890", name: "ZORAT", symbol: "$ZORAT", handle: "@zoraterminal", imageUrl: "https://picsum.photos/seed/zorat/200", flywheels: ["RevShare", "Airdrop"], holders: 9, volume24h: 28, pnl7d: 100.0, lastActivated: "Airdrop" },
    { address: "0x890abcdef1234567890abcdef1234567890abcd", name: "LGHT", symbol: "$LGHT", handle: "@lght", imageUrl: "https://picsum.photos/seed/lght/200", flywheels: ["Buyback"], holders: 5, volume24h: 61, pnl7d: 99.1, lastActivated: "RevShare" },
    { address: "0xabcdef1234567890abcdef1234567890abcdef12", name: "GREMP", symbol: "$GREMP", handle: "@gremplin", imageUrl: "https://picsum.photos/seed/gremp/200", flywheels: ["Airdrop", "RevShare"], holders: 8, volume24h: 7, pnl7d: 99.7, lastActivated: "Buyback" },
    { address: "0xcdef1234567890abcdef1234567890abcdef1234", name: "WBNNS", symbol: "$WBNNS", handle: "@wbnns", imageUrl: "https://picsum.photos/seed/wbnns/200", flywheels: ["Buyback", "Airdrop"], holders: 7, volume24h: 45, pnl7d: 99.4, lastActivated: "Airdrop" },
  ];
  
  export async function fetchTopCoins(): Promise<CoinRow[]> {
    if (USE_MOCK) {
      // Sort by volume24h descending to match the design
      return [...MOCK_COINS].sort((a, b) => b.volume24h - a.volume24h);
    }
  
    // API fallback code stays the same...
    const endpoint = process.env.ZORA_COINS_ENDPOINT;
    if (!endpoint) return [...MOCK_COINS];
  
    const query = /* GraphQL */ `
      query TopCoins($limit: Int!) {
        coins(orderBy: VOLUME_24H_DESC, first: $limit) {
          edges {
            node {
              address
              name
              symbol
              handle
              imageUrl
              flywheels
              holders
              volume24h
              pnl7d
              lastActivated
            }
          }
        }
      }
    `;
  
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(process.env.ZORA_API_KEY ? { "x-api-key": process.env.ZORA_API_KEY } : {}),
        },
        body: JSON.stringify({ query, variables: { limit: 20 } }),
        next: { revalidate: 0 },
      });
  
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const edges = json?.data?.coins?.edges ?? [];
      return edges.map((e: any) => ({
        address: e.node.address,
        name: e.node.name ?? null,
        symbol: e.node.symbol,
        handle: e.node.handle,
        imageUrl: e.node.imageUrl,
        flywheels: e.node.flywheels ?? [],
        holders: Number(e.node.holders ?? 0),
        volume24h: Number(e.node.volume24h ?? 0),
        pnl7d: Number(e.node.pnl7d ?? 0),
        lastActivated: e.node.lastActivated ?? "Unknown",
      }));
    } catch {
      return [...MOCK_COINS];
    }
  }