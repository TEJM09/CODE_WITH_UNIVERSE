import { DailyCodingTask } from '../types';

export const DAILY_CODING_POOL: DailyCodingTask[] = [
  {
    id: 'dt_01',
    protocolCode: 'PRT-0x1A',
    title: 'Bitwise Parity & Power Verification',
    universeId: 'world_1',
    universeName: 'Earth Prime',
    topic: 'Bitwise Logic & Bit Manipulation',
    difficulty: 'Scout',
    story: 'Corrupted binary telemetry is flooding Earth Prime power relays. You must write a routine to verify if incoming energy packets are exact powers of two using fast bitwise operations.',
    prompt: 'Given an array of integers {4, 7, 16, 25, 64, 100}, print each number followed by "POWER_OF_2" if it is a power of 2, or "ODD_PACKET" otherwise. Each result on its own line.',
    starterCode: `#include <iostream>
#include <vector>

bool isPowerOfTwo(int n) {
    // TODO: Use bitwise & logic: (n > 0) && ((n & (n - 1)) == 0)
    return false;
}

int main() {
    std::vector<int> packets = {4, 7, 16, 25, 64, 100};
    for (int p : packets) {
        if (isPowerOfTwo(p)) {
            std::cout << p << " POWER_OF_2\\n";
        } else {
            std::cout << p << " ODD_PACKET\\n";
        }
    }
    return 0;
}
`,
    solutionSample: `#include <iostream>
#include <vector>

bool isPowerOfTwo(int n) {
    return (n > 0) && ((n & (n - 1)) == 0);
}

int main() {
    std::vector<int> packets = {4, 7, 16, 25, 64, 100};
    for (int p : packets) {
        if (isPowerOfTwo(p)) {
            std::cout << p << " POWER_OF_2\\n";
        } else {
            std::cout << p << " ODD_PACKET\\n";
        }
    }
    return 0;
}
`,
    expectedOutput: `4 POWER_OF_2
7 ODD_PACKET
16 POWER_OF_2
25 ODD_PACKET
64 POWER_OF_2
100 ODD_PACKET`,
    xpReward: 300,
    coinReward: 150,
    completed: false,
    hints: [
      'In binary, powers of 2 have only 1 bit set (e.g., 16 is 00010000).',
      'n - 1 flips all bits up to the lowest set bit. So (n & (n - 1)) evaluates to 0 for powers of 2!',
    ],
  },
  {
    id: 'dt_02',
    protocolCode: 'PRT-0x2B',
    title: 'Stack Frame Recursion Echo',
    universeId: 'world_2',
    universeName: 'Function Nexus',
    topic: 'Recursion & Call Stack Tracing',
    difficulty: 'Vanguard',
    story: 'The Function Nexus call-stack gateway has an echo loop. Transmit a recursive string inverter function to collapse stack overflow anomalies.',
    prompt: 'Implement a recursive function `void reverseEcho(const std::string& str, int index)` that prints the characters of the string "NEXUS" in reverse order followed by a newline.',
    starterCode: `#include <iostream>
#include <string>

void reverseEcho(const std::string& str, int index) {
    // TODO: Base case: if index < 0, return
    // Print str[index], then recursively call reverseEcho with index - 1
}

int main() {
    std::string word = "NEXUS";
    reverseEcho(word, word.length() - 1);
    std::cout << std::endl;
    return 0;
}
`,
    solutionSample: `#include <iostream>
#include <string>

void reverseEcho(const std::string& str, int index) {
    if (index < 0) return;
    std::cout << str[index];
    reverseEcho(str, index - 1);
}

int main() {
    std::string word = "NEXUS";
    reverseEcho(word, word.length() - 1);
    std::cout << std::endl;
    return 0;
}
`,
    expectedOutput: `SUXEN`,
    xpReward: 350,
    coinReward: 180,
    completed: false,
    hints: [
      'Start index at str.length() - 1.',
      'Print str[index] directly without spaces.',
      'Decrement index until it drops below 0.',
    ],
  },
  {
    id: 'dt_03',
    protocolCode: 'PRT-0x3C',
    title: 'Shield Generator Encapsulation',
    universeId: 'world_3',
    universeName: 'Object Realm',
    topic: 'C++ Classes & Data Encapsulation',
    difficulty: 'Vanguard',
    story: 'Build an encapsulated ShieldGenerator class with private integrity fields and public calibration methods to withstand malware intrusions.',
    prompt: 'Create class `ShieldGenerator` with private int `shieldHP = 100`. Add public methods: `void absorb(int dmg)` and `void boost(int heal)` and `int getIntegrity() const`. Print initial integrity, integrity after 35 damage, and integrity after 15 boost.',
    starterCode: `#include <iostream>

class ShieldGenerator {
private:
    int shieldHP;

public:
    ShieldGenerator(int initial) : shieldHP(initial) {}

    void absorb(int dmg) {
        // TODO: shieldHP -= dmg;
    }

    void boost(int heal) {
        // TODO: shieldHP += heal;
    }

    int getIntegrity() const {
        return shieldHP;
    }
};

int main() {
    ShieldGenerator gen(100);
    std::cout << "Init: " << gen.getIntegrity() << "\\n";
    gen.absorb(35);
    std::cout << "After Strike: " << gen.getIntegrity() << "\\n";
    gen.boost(15);
    std::cout << "After Boost: " << gen.getIntegrity() << "\\n";
    return 0;
}
`,
    solutionSample: `#include <iostream>

class ShieldGenerator {
private:
    int shieldHP;

public:
    ShieldGenerator(int initial) : shieldHP(initial) {}

    void absorb(int dmg) {
        shieldHP -= dmg;
    }

    void boost(int heal) {
        shieldHP += heal;
    }

    int getIntegrity() const {
        return shieldHP;
    }
};

int main() {
    ShieldGenerator gen(100);
    std::cout << "Init: " << gen.getIntegrity() << "\\n";
    gen.absorb(35);
    std::cout << "After Strike: " << gen.getIntegrity() << "\\n";
    gen.boost(15);
    std::cout << "After Boost: " << gen.getIntegrity() << "\\n";
    return 0;
}
`,
    expectedOutput: `Init: 100
After Strike: 65
After Boost: 80`,
    xpReward: 350,
    coinReward: 160,
    completed: false,
    hints: [
      'Encapsulation prevents outside access to shieldHP directly.',
      'Implement absorb() to subtract damage and boost() to add energy.',
    ],
  },
  {
    id: 'dt_04',
    protocolCode: 'PRT-0x4D',
    title: 'Polymorphic Drone Swarm Interface',
    universeId: 'world_5',
    universeName: 'Polymorphism City',
    topic: 'Virtual Functions & Dynamic Dispatch',
    difficulty: 'Elite',
    story: 'Polymorphism City defensive turrets must fire via abstract base pointer interface so new drone variants can be deployed dynamically.',
    prompt: 'Implement base class `Drone` with `virtual void ping() { std::cout << "Drone Online\\n"; }`. Derive `ReconDrone` and override `ping()` to print "Recon Drone Scanning Area\\n". In main, dispatch via `Drone*` pointer to display polymorphic dispatch.',
    starterCode: `#include <iostream>
#include <vector>

class Drone {
public:
    virtual void ping() {
        std::cout << "Drone Online\\n";
    }
    virtual ~Drone() = default;
};

class ReconDrone : public Drone {
public:
    // TODO: Override ping() to print "Recon Drone Scanning Area\\n"
};

int main() {
    Drone base;
    ReconDrone recon;

    Drone* d1 = &base;
    Drone* d2 = &recon;

    d1->ping();
    d2->ping();

    return 0;
}
`,
    solutionSample: `#include <iostream>
#include <vector>

class Drone {
public:
    virtual void ping() {
        std::cout << "Drone Online\\n";
    }
    virtual ~Drone() = default;
};

class ReconDrone : public Drone {
public:
    void ping() override {
        std::cout << "Recon Drone Scanning Area\\n";
    }
};

int main() {
    Drone base;
    ReconDrone recon;

    Drone* d1 = &base;
    Drone* d2 = &recon;

    d1->ping();
    d2->ping();

    return 0;
}
`,
    expectedOutput: `Drone Online
Recon Drone Scanning Area`,
    xpReward: 450,
    coinReward: 220,
    completed: false,
    hints: [
      'Mark the overridden method with `override` keyword in ReconDrone.',
      'The virtual table resolves the derived call at runtime through the pointer.',
    ],
  },
  {
    id: 'dt_05',
    protocolCode: 'PRT-0x5E',
    title: 'Raw Pointer Memory Array Scan',
    universeId: 'world_6',
    universeName: 'Memory Dimension',
    topic: 'Pointer Arithmetic & Memory Offsets',
    difficulty: 'Elite',
    story: 'A memory leak has fragmented sector 0x7FFE. Walk an integer array using pure pointer arithmetic without bracket indexing (`[]`) to sum safe sector addresses.',
    prompt: 'Given array `int sectors[] = {12, 24, 36, 48, 60};`, calculate the sum of all elements using a pointer `int* ptr = sectors` and pointer increments `ptr++`. Print "SUM: <sum>\\n".',
    starterCode: `#include <iostream>

int main() {
    int sectors[] = {12, 24, 36, 48, 60};
    int n = 5;
    int sum = 0;

    int* ptr = sectors;
    // TODO: Loop n times, add *ptr to sum, and advance ptr++

    std::cout << "SUM: " << sum << "\\n";
    return 0;
}
`,
    solutionSample: `#include <iostream>

int main() {
    int sectors[] = {12, 24, 36, 48, 60};
    int n = 5;
    int sum = 0;

    int* ptr = sectors;
    for (int i = 0; i < n; ++i) {
        sum += *ptr;
        ptr++;
    }

    std::cout << "SUM: " << sum << "\\n";
    return 0;
}
`,
    expectedOutput: `SUM: 180`,
    xpReward: 400,
    coinReward: 200,
    completed: false,
    hints: [
      'Dereference with *ptr to retrieve the integer value.',
      'Advance the address with ptr++.',
      'The sum of 12 + 24 + 36 + 48 + 60 is 180.',
    ],
  },
  {
    id: 'dt_06',
    protocolCode: 'PRT-0x6F',
    title: 'STL Vector Lambda Transformation',
    universeId: 'world_7',
    universeName: 'STL Galaxy',
    topic: 'STL <vector>, <algorithm> & C++ Lambdas',
    difficulty: 'Vanguard',
    story: 'The STL Galaxy hyperspace beacons are out of sync. Filter and transform an energy coordinate vector using `std::for_each` and a C++ lambda expression.',
    prompt: 'Given `std::vector<int> vals = {3, 8, 12, 17, 20};`, print each number multiplied by 2 separated by spaces, ending with a newline.',
    starterCode: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> vals = {3, 8, 12, 17, 20};

    // TODO: Iterate and print (x * 2) followed by a space
    for (size_t i = 0; i < vals.size(); ++i) {
        // output
    }
    std::cout << "\\n";

    return 0;
}
`,
    solutionSample: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> vals = {3, 8, 12, 17, 20};

    for (size_t i = 0; i < vals.size(); ++i) {
        std::cout << vals[i] * 2;
        if (i + 1 < vals.size()) std::cout << " ";
    }
    std::cout << "\\n";

    return 0;
}
`,
    expectedOutput: `6 16 24 34 40`,
    xpReward: 350,
    coinReward: 175,
    completed: false,
    hints: [
      'Multiply each element by 2.',
      'Print with space delimiters: 6 16 24 34 40.',
    ],
  },
  {
    id: 'dt_07',
    protocolCode: 'PRT-0x7A',
    title: 'STL Map Anomaly Key Frequency',
    universeId: 'world_7',
    universeName: 'STL Galaxy',
    topic: 'std::map & Associative Containers',
    difficulty: 'Legend',
    story: 'Decode frequency of intercepted corrupted signal transmissions using std::map key-value mapping.',
    prompt: 'Given vector of signal tags `{"ALPHA", "BETA", "ALPHA", "GAMMA", "BETA", "ALPHA"}`, insert them into `std::map<std::string, int> freq`. Print each key and count in format "<KEY>: <COUNT>\\n" in alphabetical order.',
    starterCode: `#include <iostream>
#include <string>
#include <vector>
#include <map>

int main() {
    std::vector<std::string> signals = {"ALPHA", "BETA", "ALPHA", "GAMMA", "BETA", "ALPHA"};
    std::map<std::string, int> freq;

    // TODO: Count occurrences in freq map

    for (const auto& pair : freq) {
        std::cout << pair.first << ": " << pair.second << "\\n";
    }
    return 0;
}
`,
    solutionSample: `#include <iostream>
#include <string>
#include <vector>
#include <map>

int main() {
    std::vector<std::string> signals = {"ALPHA", "BETA", "ALPHA", "GAMMA", "BETA", "ALPHA"};
    std::map<std::string, int> freq;

    for (const auto& s : signals) {
        freq[s]++;
    }

    for (const auto& pair : freq) {
        std::cout << pair.first << ": " << pair.second << "\\n";
    }
    return 0;
}
`,
    expectedOutput: `ALPHA: 3
BETA: 2
GAMMA: 1`,
    xpReward: 500,
    coinReward: 250,
    completed: false,
    hints: [
      'std::map automatically sorts keys alphabetically.',
      'Use freq[s]++ to increment each occurrence.',
    ],
  },
  {
    id: 'dt_08',
    protocolCode: 'PRT-0x8B',
    title: 'Const-Correct Compiler Optimization',
    universeId: 'world_8',
    universeName: 'Core Compiler',
    topic: 'Const References & Zero-Copy Calls',
    difficulty: 'Legend',
    story: 'Core Compiler -O3 optimization requires strictly const-correct references to prevent unnecessary memory copy overhead during high-speed parsing.',
    prompt: 'Implement function `void printReport(const std::string& label, const int& code)` that outputs "STATUS: [" << label << "] CODE: " << code << "\\n". Call with label "CORE_STABLE" and code 200.',
    starterCode: `#include <iostream>
#include <string>

// TODO: Define printReport(const std::string& label, const int& code)

int main() {
    std::string status = "CORE_STABLE";
    int code = 200;
    printReport(status, code);
    return 0;
}
`,
    solutionSample: `#include <iostream>
#include <string>

void printReport(const std::string& label, const int& code) {
    std::cout << "STATUS: [" << label << "] CODE: " << code << "\\n";
}

int main() {
    std::string status = "CORE_STABLE";
    int code = 200;
    printReport(status, code);
    return 0;
}
`,
    expectedOutput: `STATUS: [CORE_STABLE] CODE: 200`,
    xpReward: 500,
    coinReward: 260,
    completed: false,
    hints: [
      'Pass strings as `const std::string&` to eliminate heap copies.',
      'Format output strictly to match `STATUS: [CORE_STABLE] CODE: 200`.',
    ],
  }
];

/**
 * Returns 3 deterministic daily coding tasks based on the current calendar date
 */
export function getDailyTasksForDate(dateStr?: string): DailyCodingTask[] {
  const d = dateStr ? new Date(dateStr) : new Date();
  // Generate pseudo-random daily seed from year, month, day
  const seed = (d.getFullYear() * 10000) + ((d.getMonth() + 1) * 100) + d.getDate();
  
  const pool = [...DAILY_CODING_POOL];
  const selected: DailyCodingTask[] = [];

  // Simple LCG PRNG
  let state = seed;
  for (let i = 0; i < 3; i++) {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    const index = state % pool.length;
    selected.push(pool.splice(index, 1)[0]);
  }

  return selected;
}
