#ifndef LEVEL_HPP
#define LEVEL_HPP

#include "Challenge.hpp"
#include "Reward.hpp"
#include "Enemy.hpp"
#include <string>
#include <memory>

class Level {
private:
    std::string id;
    std::string title;
    std::string universeId;
    int order;
    std::string type; // "mission" or "boss"
    std::string story;
    Challenge challenge;
    Reward reward;
    std::shared_ptr<Enemy> enemy;

public:
    Level() = default;
    Level(const std::string& id, const std::string& title, const std::string& universeId,
          int order, const std::string& type, const std::string& story,
          const Challenge& challenge, const Reward& reward, std::shared_ptr<Enemy> enemy = nullptr)
        : id(id), title(title), universeId(universeId), order(order), type(type),
          story(story), challenge(challenge), reward(reward), enemy(enemy) {}

    // Getters
    std::string getId() const { return id; }
    std::string getTitle() const { return title; }
    std::string getUniverseId() const { return universeId; }
    int getOrder() const { return order; }
    std::string getType() const { return type; }
    std::string getStory() const { return story; }
    const Challenge& getChallenge() const { return challenge; }
    const Reward& getReward() const { return reward; }
    std::shared_ptr<Enemy> getEnemy() const { return enemy; }

    bool isBossLevel() const { return type == "boss"; }
};

#endif // LEVEL_HPP
