// Simple, short, game-oriented explanations for all levels to eliminate verbose text
export interface SimpleLevelExplanation {
  shortGoal: string;
  simpleSteps: string[];
  targetOutput: string;
  quickTip?: string;
}

export const GAME_EXPLANATIONS: Record<string, SimpleLevelExplanation> = {
  w1_l1: {
    shortGoal: 'Multiply energy by multiplier and print the result.',
    simpleSteps: [
      'Set int energy = 100; and double multiplier = 1.75;',
      'Print the product using: cout << energy * multiplier << endl;',
    ],
    targetOutput: '175',
    quickTip: 'double supports decimal numbers like 1.75.',
  },
  w1_l2: {
    shortGoal: 'Calculate quotient and remainder of 45 divided by 7.',
    simpleSteps: [
      'Use a / b for division and a % b for remainder.',
      'Print both separated by a space: cout << quotient << " " << remainder << endl;',
    ],
    targetOutput: '6 3',
    quickTip: '% (modulo) gives the leftover remainder.',
  },
  w1_l3: {
    shortGoal: 'Check shields and online status with an if-statement.',
    simpleSteps: [
      'Set int shields = 85; and bool isOnline = true;',
      'If (shields >= 80 && isOnline), print "ACCESS GRANTED: 100% SECURE".',
    ],
    targetOutput: 'ACCESS GRANTED: 100% SECURE',
    quickTip: '&& means both conditions must be true.',
  },
  w2_l1: {
    shortGoal: 'Create an amplify() function and call it with (12, 4).',
    simpleSteps: [
      'Define: int amplify(int base, int factor) { return base * factor + 10; }',
      'In main(), call amplify(12, 4) and print the return value.',
    ],
    targetOutput: '58',
    quickTip: '12 * 4 + 10 = 58.',
  },
  w2_l2: {
    shortGoal: 'Loop through the array and find the maximum spike.',
    simpleSteps: [
      'Array: int spikes[5] = {14, 82, 35, 99, 41};',
      'Loop through elements to find max (99) and print "Max Spike: 99".',
    ],
    targetOutput: 'Max Spike: 99',
    quickTip: 'Use for (int i = 0; i < 5; i++) to inspect each number.',
  },
  w2_l3: {
    shortGoal: 'Calculate 6! (6 factorial) using recursion.',
    simpleSteps: [
      'Define: long long factorial(int n) { if (n <= 1) return 1; return n * factorial(n - 1); }',
      'In main(), print factorial(6).',
    ],
    targetOutput: '720',
    quickTip: '6 * 5 * 4 * 3 * 2 * 1 = 720.',
  },
  w3_l1: {
    shortGoal: 'Create a Guardian class with name "Aegis" and power 250.',
    simpleSteps: [
      'Store private variables string name and int power.',
      'Add a method to print: "Guardian: Aegis | Power: 250".',
    ],
    targetOutput: 'Guardian: Aegis | Power: 250',
    quickTip: 'Constructors set up initial member values.',
  },
  w3_l2: {
    shortGoal: 'Create a Resource class with constructor and destructor.',
    simpleSteps: [
      'Constructor prints "Resource Allocated".',
      'Destructor (~Resource()) prints "Resource Deallocated".',
    ],
    targetOutput: 'Resource Allocated\nResource Deallocated',
    quickTip: '~Resource() runs automatically when the object goes out of scope.',
  },
  w3_l3: {
    shortGoal: 'Overload operator+ to fuse two PowerCore objects.',
    simpleSteps: [
      'Add PowerCore operator+(const PowerCore& other) { return PowerCore(energy + other.energy); }',
      'Add core1(150) + core2(200) and print "Fused Energy: 350".',
    ],
    targetOutput: 'Fused Energy: 350',
    quickTip: 'Operator overloading lets you use + with custom classes.',
  },
  w4_l1: {
    shortGoal: 'Inherit Knight from Warrior and calculate total strike damage.',
    simpleSteps: [
      'Base Warrior has protected: int baseDmg = 75;',
      'Derived Knight adds weaponBonus = 25. Print "Knight strikes with 100 DMG!".',
    ],
    targetOutput: 'Knight strikes with 100 DMG!',
    quickTip: 'class Knight : public Warrior inherits baseDmg.',
  },
  w4_l2: {
    shortGoal: 'Chain constructors through multi-level inheritance.',
    simpleSteps: [
      'Device -> Computer -> QuantumNode with parameters (id, ram, qubits).',
      'Print "Server: QS-9000, RAM: 128GB, Qubits: 64".',
    ],
    targetOutput: 'Server: QS-9000, RAM: 128GB, Qubits: 64',
    quickTip: 'Pass arguments up using initializer lists: Computer(...) : Device(id).',
  },
  w4_l3: {
    shortGoal: 'Solve the Diamond Problem using virtual inheritance.',
    simpleSteps: [
      'Inherit with: class Left : virtual public Node and class Right : virtual public Node.',
      'Diamond class inherits once without ambiguity. Print "Resolved Diamond Node Val: 42".',
    ],
    targetOutput: 'Resolved Diamond Node Val: 42',
    quickTip: 'virtual public prevents duplicate base class copies.',
  },
  w5_l1: {
    shortGoal: 'Override a virtual method to cast Flamestrike.',
    simpleSteps: [
      'Base Spell has: virtual void cast();',
      'FireSpell overrides cast() to print: "Flamestrike Burst!".',
    ],
    targetOutput: 'Flamestrike Burst!',
    quickTip: 'virtual enables runtime dynamic dispatch.',
  },
  w5_l2: {
    shortGoal: 'Create an abstract Portal class with pure virtual jump().',
    simpleSteps: [
      'Define: virtual void jump() = 0; in Portal.',
      'Implement in WarpGate to print "Hyperlane Jump Active: Sector 7".',
    ],
    targetOutput: 'Hyperlane Jump Active: Sector 7',
    quickTip: '= 0 makes a method pure virtual and class abstract.',
  },
  w5_l3: {
    shortGoal: 'Call battleCry() on a vector of Hero base pointers.',
    simpleSteps: [
      'Store Mage and Warrior in vector<Hero*>.',
      'Iterate through pointers and call ->battleCry().',
    ],
    targetOutput: 'Arcane Nova\nWhirlwind Slash',
    quickTip: 'Polymorphism executes the child version via base pointers.',
  },
  w6_l1: {
    shortGoal: 'Modify a variable using its pointer (*plasmaPtr += 20).',
    simpleSteps: [
      'Define: void chargeCannon(int* plasmaPtr) { *plasmaPtr += 20; }',
      'Pass &plasma (100) and print "Charged Plasma: 120".',
    ],
    targetOutput: 'Charged Plasma: 120',
    quickTip: '* dereferences a pointer to edit the value in memory.',
  },
  w6_l2: {
    shortGoal: 'Allocate an array on the heap with new and free it with delete[].',
    simpleSteps: [
      'int* buffer = new int[4]{10, 20, 30, 40};',
      'Sum elements to 100, delete[] buffer, and print "Heap Buffer Sum: 100".',
    ],
    targetOutput: 'Heap Buffer Sum: 100',
    quickTip: 'Always call delete[] for memory allocated with new[].',
  },
  w6_l3: {
    shortGoal: 'Create a linked list of 2 nodes.',
    simpleSteps: [
      'struct Node { int data; Node* next; };',
      'Link node1(50) -> node2(100) and print "Node 1: 50 -> Node 2: 100".',
    ],
    targetOutput: 'Node 1: 50 -> Node 2: 100',
    quickTip: 'head->next points to the second node.',
  },
  w7_l1: {
    shortGoal: 'Sort a vector of speeds and print them space-separated.',
    simpleSteps: [
      'vector<int> speeds = {450, 120, 890, 310}; push_back(600);',
      'sort(speeds.begin(), speeds.end()) and print: "120 310 450 600 890".',
    ],
    targetOutput: '120 310 450 600 890',
    quickTip: 'Include <vector> and <algorithm>.',
  },
  w7_l2: {
    shortGoal: 'Store frequency in std::map and look it up by key.',
    simpleSteps: [
      'map<string, int> planetCores; planetCores["Cosmos"] = 500;',
      'Print "Cosmos Core Frequency: " << planetCores["Cosmos"].',
    ],
    targetOutput: 'Cosmos Core Frequency: 500',
    quickTip: 'map stores key-value pairs sorted by key.',
  },
  w7_l3: {
    shortGoal: 'Process a FIFO queue of Hydra heads.',
    simpleSteps: [
      'Push "Fire Head", "Ice Head", "Toxic Head" into queue<string>.',
      'Pop and print each until empty, then print "Hydra Queue Cleared!".',
    ],
    targetOutput: 'Defeated: Fire Head\nDefeated: Ice Head\nDefeated: Toxic Head\nHydra Queue Cleared!',
    quickTip: 'FIFO: First In, First Out with .front() and .pop().',
  },
  w8_l1: {
    shortGoal: 'Create a generic template function getMaxValue<T>(a, b).',
    simpleSteps: [
      'template <typename T> T getMaxValue(T a, T b) { return (a > b) ? a : b; }',
      'Print "Int Max: 320 | Double Max: 4.5".',
    ],
    targetOutput: 'Int Max: 320 | Double Max: 4.5',
    quickTip: 'Templates let one function work with multiple data types.',
  },
  w8_l2: {
    shortGoal: 'Handle division by zero with try and catch.',
    simpleSteps: [
      'In safeDivide(a, b): if (b == 0) throw runtime_error("Division by zero detected!");',
      'Catch the error and print: "Caught Exception: Division by zero detected!".',
    ],
    targetOutput: 'Caught Exception: Division by zero detected!',
    quickTip: 'Use throw std::runtime_error(...) and catch (const std::exception& e).',
  },
  w8_l3: {
    shortGoal: 'Assemble the final UniverseModule and restore the CodeVerse!',
    simpleSteps: [
      'Subsystems print: "Memory: Stable" and "Logic: Purified".',
      'Print final victory message: "THE CODEVERSE IS RESTORED 100%!".',
    ],
    targetOutput: 'Memory: Stable\nLogic: Purified\nTHE CODEVERSE IS RESTORED 100%!',
    quickTip: 'The ultimate boss battle restoring the entire code universe.',
  },
};

export function getLevelExplanation(levelId: string, fallbackPrompt?: string, fallbackExpected?: string): SimpleLevelExplanation {
  if (GAME_EXPLANATIONS[levelId]) {
    return GAME_EXPLANATIONS[levelId];
  }
  return {
    shortGoal: fallbackPrompt ? fallbackPrompt.split('.')[0] + '.' : 'Solve the coding challenge.',
    simpleSteps: [
      fallbackPrompt || 'Write the C++ solution to pass test cases.',
      `Match the expected output: ${fallbackExpected || ''}`
    ],
    targetOutput: fallbackExpected || '',
  };
}
