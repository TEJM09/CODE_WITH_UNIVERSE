#ifndef USER_HPP
#define USER_HPP

#include <string>
#include <iostream>

class User {
private:
    std::string id;
    std::string username;
    std::string email;
    std::string passwordHash;
    std::string avatar;
    std::string createdAt;

public:
    // Constructors
    User() = default;
    User(const std::string& id, const std::string& username, const std::string& email,
         const std::string& passwordHash, const std::string& avatar, const std::string& createdAt = "")
        : id(id), username(username), email(email), passwordHash(passwordHash), avatar(avatar), createdAt(createdAt) {}

    // Destructor
    virtual ~User() = default;

    // Getters & Setters (Encapsulation)
    std::string getId() const { return id; }
    std::string getUsername() const { return username; }
    std::string getEmail() const { return email; }
    std::string getPasswordHash() const { return passwordHash; }
    std::string getAvatar() const { return avatar; }
    std::string getCreatedAt() const { return createdAt; }

    void setAvatar(const std::string& newAvatar) { avatar = newAvatar; }
    void setUsername(const std::string& newUsername) { username = newUsername; }
    void setPasswordHash(const std::string& newHash) { passwordHash = newHash; }

    // Validation Methods
    static bool isValidEmail(const std::string& email) {
        size_t atPos = email.find('@');
        size_t dotPos = email.rfind('.');
        return (atPos != std::string::npos && dotPos != std::string::npos && atPos < dotPos && atPos > 0 && dotPos < email.length() - 1);
    }

    static bool isValidPassword(const std::string& password) {
        return password.length() >= 6;
    }
};

#endif // USER_HPP
