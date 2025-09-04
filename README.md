# Ikman.lk Clone App (React Native + Expo)

## Project Overview
**Ikman.lk Clone App** is a beginner-friendly mobile application built with **React Native** and **Expo**.  
This project is a clone of **Ikman.lk**, one of Sri Lanka’s most popular classified advertisement platforms.  
The app allows users to browse categories, view listings, check product details, and navigate using bottom tabs and stack navigation.  

This project uses **dummy data only** and demonstrates React Native fundamentals such as components, props, state management, FlatList, and React Navigation.

---

## Features

### Core Features
- Browse categories: Cars, Electronics, Jobs, Property.
- View product listings under each category.
- Check product details: title, price, description, and images.
- Navigate between Home, My Ads, Profile, and other screens using Bottom Tab Navigation.
- Smooth stack navigation between listings and details.

### Additional Features
- **Create Listing Flow:** Users can create new ads, select categories, add details, and upload images.
- **Authentication:** Login, Register, and Forgot Password screens.
- **Chat Functionality:** View chat list and individual chat screens.
- **Favorites:** Save favorite items for later.
- **Settings:** Account and notification settings.

---

## Project Structure

app/

├── _layout.tsx # Root Stack Navigator
├── (tabs)/ # Bottom Tab Navigation
│ ├── _layout.tsx # Bottom Tabs Layout
│ ├── index.tsx # Home Screen
│ ├── search.tsx # Search Screen
│ ├── chat.tsx # Chat Screen
│ ├── myads.tsx # My Ads Screen
│ ├── profile.tsx # Profile Screen

├── listings/
│ ├── [categoryId].tsx # Listings by category
│ ├── details/[id].tsx # Product details page

├── create-listing/ # For creating new ads
│ ├── details-form.tsx # Details form
├── auth/ # Authentication flows

│ ├── login.tsx # Login screen
│ ├── register.tsx # Registration screen
│ ├── forgot-password.tsx # Password recovery

├── chat/ # Enhanced chat functionality
│ ├── [chatId].tsx # Individual chat screen
│ ├── list.tsx # Chat list screen

├── favorites/ # Saved items
│ ├── index.tsx # Favorites list

├── settings/ # App settings
│ ├── profile.tsx # Profile settings



Contributing
This is a beginner-level project. Feel free to submit issues or pull requests to improve the app UI/UX or add features.

License
This project is for learning purposes only.

Author: MRFR.Nifla
Project: Ikman.lk Mobile App Clone (React Native + Expo)
