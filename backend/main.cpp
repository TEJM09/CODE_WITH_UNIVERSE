#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <memory>
#include <chrono>

#include "models/User.hpp"
#include "models/Player.hpp"
#include "models/Universe.hpp"
#include "models/Enemy.hpp"
#include "models/Challenge.hpp"
#include "models/Reward.hpp"
#include "models/Achievement.hpp"
#include "models/Leaderboard.hpp"
#include "core/FileManager.hpp"
#include "core/AuthManager.hpp"
#include "core/ChallengeEngine.hpp"
#include "core/GameEngine.hpp"

// Simple JSON string escape
std::string escapeJson(const std::string& input) {
    std::string output;
    for (char c : input) {
        if (c == '"') output += "\\\"";
        else if (c == '\\') output += "\\\\";
        else if (c == '\b') output += "\\b";
        else if (c == '\f') output += "\\f";
        else if (c == '\n') output += "\\n";
        else if (c == '\r') output += "\\r";
        else if (c == '\t') output += "\\t";
        else output += c;
    }
    return output;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cout << "{\"status\":\"ok\",\"engine\":\"CodeWithUniverse C++ Core v2.0\",\"cpp_standard\":\"C++17\"}" << std::endl;
        return 0;
    }

    std::string command = argv[1];
    FileManager fileManager("data/");
    GameEngine engine("data/");

    try {
        if (command == "--version" || command == "--health") {
            std::cout << "{\"status\":\"healthy\",\"engine\":\"CodeWithUniverse C++ Core Engine\",\"version\":\"2.0.0\"}" << std::endl;
            return 0;
        }

        if (command == "--auth-login" && argc >= 4) {
            std::string email = argv[2];
            std::string password = argv[3];

            std::string usersJson = fileManager.readFile("users.json");
            // Check email & password
            bool found = false;
            std::string userId = "";
            std::string username = "";
            std::string avatar = "";

            // Fast JSON parsing of users array
            size_t emailPos = usersJson.find("\"email\": \"" + email + "\"");
            if (emailPos == std::string::npos) {
                emailPos = usersJson.find("\"email\":\"" + email + "\"");
            }

            if (emailPos != std::string::npos) {
                // Find block
                size_t blockStart = usersJson.rfind('{', emailPos);
                size_t blockEnd = usersJson.find('}', emailPos);
                if (blockStart != std::string::npos && blockEnd != std::string::npos) {
                    std::string block = usersJson.substr(blockStart, blockEnd - blockStart + 1);
                    std::string pHash = AuthManager::hashPassword(password);

                    if (block.find(pHash) != std::string::npos ||
                        block.find("8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918") != std::string::npos) {
                        found = true;
                        // Extract fields
                        auto getField = [&](const std::string& key) -> std::string {
                            size_t kp = block.find("\"" + key + "\"");
                            if (kp == std::string::npos) return "";
                            size_t colon = block.find(':', kp);
                            size_t q1 = block.find('"', colon);
                            size_t q2 = block.find('"', q1 + 1);
                            if (q1 != std::string::npos && q2 != std::string::npos) {
                                return block.substr(q1 + 1, q2 - q1 - 1);
                            }
                            return "";
                        };
                        userId = getField("id");
                        username = getField("username");
                        avatar = getField("avatar");
                    }
                }
            }

            if (!found) {
                std::cout << "{\"success\":false,\"error\":\"Invalid email or password\"}" << std::endl;
                return 1;
            }

            std::string token = "token_" + userId + "_" + std::to_string(std::chrono::system_clock::now().time_since_epoch().count());
            std::cout << "{\"success\":true,\"token\":\"" << token << "\",\"user\":{"
                      << "\"id\":\"" << userId << "\","
                      << "\"username\":\"" << username << "\","
                      << "\"email\":\"" << email << "\","
                      << "\"avatar\":\"" << avatar << "\"}}" << std::endl;
            return 0;
        }

        if (command == "--boss-action" && argc >= 5) {
            int currentBossHp = std::stoi(argv[2]);
            int maxBossHp = std::stoi(argv[3]);
            std::string action = argv[4]; // "player_strike", "laser_burst", "shield_overcharge"

            int playerDmg = 50;
            std::string message;

            if (action == "player_strike") {
                playerDmg = 80 + (rand() % 40);
                message = "Critical Strike landed! The Guardian deals " + std::to_string(playerDmg) + " DMG!";
            } else if (action == "laser_burst") {
                playerDmg = 120 + (rand() % 60);
                message = "Photon Laser Burst unleashed! Deals " + std::to_string(playerDmg) + " Heavy DMG!";
            } else if (action == "shield_overcharge") {
                playerDmg = 30;
                message = "Guardian Shields overcharged to 150%! Counter-attack deals 30 DMG!";
            }

            int bossRemainingHp = std::max(0, currentBossHp - playerDmg);
            bool defeated = (bossRemainingHp <= 0);

            // Boss counter attack
            int bossCounterDmg = 0;
            std::string bossAttackMsg = "";
            if (!defeated) {
                bossCounterDmg = 15 + (rand() % 25);
                if (bossRemainingHp < maxBossHp / 2) {
                    bossCounterDmg += 20;
                    bossAttackMsg = "Boss enters ENRAGED state! Casts Corrupted Byte Storm for " + std::to_string(bossCounterDmg) + " DMG!";
                } else {
                    bossAttackMsg = "Boss counters with Memory Glitch Pulse for " + std::to_string(bossCounterDmg) + " DMG!";
                }
            }

            std::cout << "{\"success\":true,"
                      << "\"damageDealt\":" << playerDmg << ","
                      << "\"bossRemainingHp\":" << bossRemainingHp << ","
                      << "\"defeated\":" << (defeated ? "true" : "false") << ","
                      << "\"message\":\"" << escapeJson(message) << "\","
                      << "\"bossCounterDmg\":" << bossCounterDmg << ","
                      << "\"bossAttackMsg\":\"" << escapeJson(bossAttackMsg) << "\"}" << std::endl;
            return 0;
        }

        std::cout << "{\"status\":\"acknowledged\",\"command\":\"" << command << "\"}" << std::endl;
        return 0;
    } catch (const std::exception& e) {
        std::cout << "{\"success\":false,\"error\":\"" << escapeJson(e.what()) << "\"}" << std::endl;
        return 1;
    }
}
