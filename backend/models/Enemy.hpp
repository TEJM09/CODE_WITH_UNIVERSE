#ifndef ENEMY_HPP
#define ENEMY_HPP

#include <string>
#include <iostream>
#include <algorithm>

// Abstract Base Class showcasing Polymorphism
class Enemy {
protected:
    std::string name;
    std::string type; // "minion", "boss", "glitch"
    int hp;
    int maxHp;
    int attackPower;
    std::string element;
    std::string avatar;

public:
    Enemy(const std::string& name, const std::string& type, int hp, int attackPower,
          const std::string& element, const std::string& avatar)
        : name(name), type(type), hp(hp), maxHp(hp), attackPower(attackPower),
          element(element), avatar(avatar) {}

    virtual ~Enemy() = default;

    // Pure Virtual Function
    virtual std::string performSpecialAttack() = 0;
    
    // Virtual Function
    virtual int calculateDamageTaken(int basePlayerDamage, const std::string& damageType) {
        if (damageType == element) {
            return static_cast<int>(basePlayerDamage * 1.5); // Elemental weakness
        }
        return basePlayerDamage;
    }

    void takeDamage(int dmg) {
        hp = std::max(0, hp - dmg);
    }

    bool isDefeated() const {
        return hp <= 0;
    }

    // Getters
    std::string getName() const { return name; }
    std::string getType() const { return type; }
    int getHp() const { return hp; }
    int getMaxHp() const { return maxHp; }
    int getAttackPower() const { return attackPower; }
    std::string getElement() const { return element; }
    std::string getAvatar() const { return avatar; }

    void setHp(int newHp) { hp = newHp; }
};

// Derived Minion Class
class Minion : public Enemy {
public:
    Minion(const std::string& name, int hp, int attackPower, const std::string& element, const std::string& avatar)
        : Enemy(name, "minion", hp, attackPower, element, avatar) {}

    virtual ~Minion() override = default;

    virtual std::string performSpecialAttack() override {
        return name + " emits a Corrupted Byte Dart dealing " + std::to_string(attackPower) + " DMG!";
    }
};

// Derived Boss Class
class Boss : public Enemy {
private:
    std::string specialAbility;
    int shield = 100;
    int rageMultiplier = 1;

public:
    Boss(const std::string& name, int hp, int attackPower, const std::string& element,
         const std::string& avatar, const std::string& specialAbility)
        : Enemy(name, "boss", hp, attackPower, element, avatar), specialAbility(specialAbility) {}

    virtual ~Boss() override = default;

    std::string getSpecialAbility() const { return specialAbility; }
    int getShield() const { return shield; }

    void damageShield(int amount) {
        shield = std::max(0, shield - amount);
    }

    virtual std::string performSpecialAttack() override {
        if (hp < maxHp / 2) {
            rageMultiplier = 2;
            return "🔥 RAGE MODE: " + name + " unleashes " + specialAbility + " dealing " +
                   std::to_string(attackPower * rageMultiplier) + " CRITICAL DMG!";
        }
        return name + " executes " + specialAbility + " dealing " + std::to_string(attackPower) + " DMG!";
    }

    virtual int calculateDamageTaken(int basePlayerDamage, const std::string& damageType) override {
        if (shield > 0) {
            return static_cast<int>(basePlayerDamage * 0.7); // Shield reduces incoming damage
        }
        return Enemy::calculateDamageTaken(basePlayerDamage, damageType);
    }
};

#endif // ENEMY_HPP
