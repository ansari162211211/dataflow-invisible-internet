import { KnowledgeTopic } from '../types';

export const KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  {
    id: 'packets',
    number: 1,
    title: 'Data Packets',
    subtitle: 'The digital envelopes of the internet',
    emoji: '📦',
    summary:
      'Large files like videos, photos, or webpages are never sent in one single massive chunk. Instead, they are sliced into millions of tiny standardized digital envelopes called "packets".',
    analogy:
      'Imagine sending a 500-page book to a friend by tearing out every page, putting each in a numbered envelope with return & destination addresses, mailing them individually, and taping them back together in order at the other end!',
    howItWorks: [
      'Each packet is usually no larger than 1,500 bytes (called the Maximum Transmission Unit or MTU).',
      'Packets contain a Header (Source IP, Destination IP, Sequence #, Checksum) and Payload (the actual data).',
      'Packets can take completely different routes across the world to avoid internet traffic jams, and get reassembled in exact order at your destination.',
    ],
    funFact:
      'A single 3-minute YouTube video at 1080p is sliced into roughly 25,000 individual data packets flying across the globe in seconds!',
    iconName: 'Package',
    color: 'from-blue-500/20 to-cyan-500/20 border-cyan-500/30 text-cyan-400',
  },
  {
    id: 'routers',
    number: 2,
    title: 'Routers',
    subtitle: 'The air traffic controllers of internet data',
    emoji: '🚦',
    summary:
      'A router is a specialized computing device that inspects the destination address on every passing packet and decides the fastest, least congested path forward.',
    analogy:
      'Think of a smart highway traffic controller standing at an intersection who checks the destination of every incoming car and points it toward the fastest open highway.',
    howItWorks: [
      'Core internet routers maintain massive "Routing Tables" containing maps of all known global network paths.',
      'They use protocols like BGP (Border Gateway Protocol) and OSPF to discover if a cable is cut or overloaded and reroute traffic in milliseconds.',
      'Your home Wi-Fi router connects your local devices (phones, laptops) and assigns private IP addresses using NAT (Network Address Translation).',
    ],
    funFact:
      'Carrier-grade core routers used by internet backbones weigh over 300 kg (660 lbs) and can route over 50 Terabits of data every single second!',
    iconName: 'Network',
    color: 'from-cyan-500/20 to-emerald-500/20 border-emerald-500/30 text-emerald-400',
  },
  {
    id: 'servers',
    number: 3,
    title: 'Servers',
    subtitle: 'High-performance digital librarians always on call',
    emoji: '🖥️',
    summary:
      'A server is a high-powered computer connected to high-speed internet 24/7, designed to listen for requests (like "Give me Wikipedia page X" or "Deliver this chat message") and respond instantly.',
    analogy:
      'Like a restaurant kitchen with chefs ready 24/7. When a waiter (your browser) sends an order (packet), the kitchen cooks the requested dish (web page) and sends it right back.',
    howItWorks: [
      'Servers run specialized software such as Web Servers (Nginx, Apache), Application Engines (Node.js, Python), and Databases (PostgreSQL, Redis).',
      'They verify user identities, check permissions, query databases, and generate custom replies in milliseconds.',
      'Modern web apps use "Serverless" and CDN edge servers placed close to users in major cities to respond almost instantly.',
    ],
    funFact:
      'When you search for something on Google, over 1,000 servers in parallel collaborate in under 0.2 seconds to compute and rank your result!',
    iconName: 'Server',
    color: 'from-emerald-500/20 to-amber-500/20 border-amber-500/30 text-amber-400',
  },
  {
    id: 'datacenters',
    number: 4,
    title: 'Data Centers',
    subtitle: 'Cathedrals of computing power & global knowledge',
    emoji: '🏢',
    summary:
      'A data center is a massive industrial building housing tens of thousands of servers, storage systems, fiber-optic switches, backup diesel generators, and liquid cooling systems.',
    analogy:
      'A fortress-like city library containing millions of automated books, protected by security guards, backup power stations, and giant air conditioners.',
    howItWorks: [
      'They feature redundant power feeds, massive backup battery UPS rooms, and diesel generators that can power the building during city blackouts.',
      'Advanced cooling uses chilled water loops, direct-to-chip liquid cooling, and hot/cold aisle air containment to keep CPUs from overheating.',
      'Hyperscale data centers span areas equal to multiple football fields and consume as much electricity as a small city.',
    ],
    funFact:
      'Some modern data centers are built near the Arctic Circle or submerged under ocean waters to utilize natural cold ambient temperatures for cooling!',
    iconName: 'Building2',
    color: 'from-amber-500/20 to-pink-500/20 border-pink-500/30 text-pink-400',
  },
  {
    id: 'fiberoptics',
    number: 5,
    title: 'Fiber Optic Cables',
    subtitle: 'Shooting laser light through microscopic glass threads',
    emoji: '✨',
    summary:
      'Over 99% of all international internet data travels through thin glass strands called optical fibers laid across land and the ocean floor, transmitting data as pulses of laser light.',
    analogy:
      'Like sending Morse code with a flashlight, but the flashlight is an invisible infrared laser flashing billions of times every second down a reflective glass pipe.',
    howItWorks: [
      'Uses the physics principle of Total Internal Reflection: light enters the glass core and bounces off the cladding without escaping.',
      'Wavelength Division Multiplexing (WDM) shoots dozens of different colored lasers down a single glass strand simultaneously to multiply capacity.',
      'There are over 550 submarine cables circling the globe, spanning more than 1.4 million kilometers on the ocean seabed.',
    ],
    funFact:
      'A single fiber strand thinner than a human hair can transmit over 200 Terabits per second—enough to download 5,000 HD movies in just one second!',
    iconName: 'Zap',
    color: 'from-pink-500/20 to-purple-500/20 border-purple-500/30 text-purple-400',
  },
  {
    id: 'protocols',
    number: 6,
    title: 'Internet Protocol & DNS',
    subtitle: 'The universal language and GPS of cyberspace',
    emoji: '🗺️',
    summary:
      'The Internet Protocol (IP) assigns every connected device a unique numerical address (like 142.250.190.46), while the Domain Name System (DNS) acts as the phonebook translating human names like "google.com" into IP addresses.',
    analogy:
      'When you want to call your friend "Alex", you don’t memorize their 10-digit number; your contacts list looks up the number and dials it for you. That is DNS!',
    howItWorks: [
      'IPv4 uses 32-bit numbers (e.g. 192.168.1.1, ~4.3 billion total addresses). IPv6 uses 128-bit addresses (providing 340 undecillion addresses).',
      'When you type a URL, your browser asks a recursive DNS resolver, root name servers, and authoritative servers in under 20ms to get the target IP.',
      'TCP (Transmission Control Protocol) guarantees that no packets are lost by asking for re-transmission if a packet goes missing.',
    ],
    funFact:
      'There are enough IPv6 addresses in existence to assign an individual IP address to every single atom on the surface of the Earth!',
    iconName: 'Globe',
    color: 'from-purple-500/20 to-indigo-500/20 border-indigo-500/30 text-indigo-400',
  },
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'How is a large message or photo sent across the internet?',
    options: [
      'As one single huge unbroken stream of data',
      'Broken down into tiny numbered packets that travel independently',
      'By sending a radio wave directly to the recipient’s phone without any cables',
      'By downloading it to a satellite first every time',
    ],
    correctIndex: 1,
    explanation:
      'Correct! Files are split into small packets (usually ~1500 bytes), each stamped with destination addresses and sequence numbers.',
  },
  {
    id: 2,
    question: 'What carries over 99% of all international internet traffic across oceans?',
    options: [
      'Space satellites in orbit',
      'Undersea fiber-optic cables on the ocean floor',
      'High-power microwave radio towers',
      'Cell phone towers on floating buoys',
    ],
    correctIndex: 1,
    explanation:
      'Correct! Over 550 submarine fiber-optic cables resting on the seabed carry virtually all international data using laser light.',
  },
  {
    id: 3,
    question: 'What happens when data is encrypted using HTTPS/TLS?',
    options: [
      'The data moves twice as fast through the cables',
      'The message is compressed to take up zero space',
      'The plain message is turned into scrambled unreadable ciphertext that only the recipient can unlock',
      'The Wi-Fi router deletes the message after sending',
    ],
    correctIndex: 2,
    explanation:
      'Correct! Encryption scrambles data into ciphertext so that anyone eavesdropping on the network only sees gibberish.',
  },
  {
    id: 4,
    question: 'What is the primary role of a router on the internet?',
    options: [
      'To store all YouTube videos forever',
      'To display web pages to the user',
      'To inspect packet destination IPs and forward them along the fastest available path',
      'To convert electrical energy into solar power',
    ],
    correctIndex: 2,
    explanation:
      'Correct! Routers act like air traffic controllers, checking destination IP addresses and forwarding packets to the next optimal hop.',
  },
];
