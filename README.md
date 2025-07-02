# Vex Cinemas - Frontend

A cinema booking system frontend built with vanilla HTML, CSS, and JavaScript. This project handles movie browsing, booking management, and admin functionality for a cinema website.

![image](https://github.com/user-attachments/assets/ee815a0e-3395-41f1-b163-e415bafa8d19)


## What it does

- **Movie browsing**: Display movies with posters, details, and synopses
- **User authentication**: Login/register system with admin privileges
- **Admin dashboard**: Create and manage movies, showtimes, and auditoriums
- **Booking system**: Handle ticket reservations
- **Responsive design**: Works on desktop and mobile

  ![image](https://github.com/user-attachments/assets/18c60c93-4934-4b39-a2e0-eb1b5b09f8c3)


## Setup

1. Clone the repo
2. Make sure you have the backend API running (expects `http://localhost/cinema-booking-backend/`), try using a local dev server with a pretty url feature.
3. Open `index.html` in a browser or serve with a local server

## Features

### Public pages

- **Homepage**: Landing page with cinema info
- **Movies**: Browse available movies
- **Bookings**: Browse user movie bookings

![image](https://github.com/user-attachments/assets/42af4204-db6d-45c8-8ca8-1aea23b53e29)


### User features

- User registration and login
- Movie browsing with search/filter
- Ticket booking system

### Admin features

- Create movies
- Manage showtimes
- Add auditoriums

## API endpoints used

The frontend expects these backend endpoints:

- `GET /api/movies.php?action=list` - Get all movies
- `POST /api/movies.php` - Create/update movies
- `GET /api/showtimes.php` - Get showtimes
- `POST /api/showtimes.php` - Create showtimes
- `POST /api/auth.php` - User authentication
- `GET /api/bookings.php` - Get bookings

## Tech stack

- HTML5
- CSS
- Vanilla JavaScript
- Axios for API calls
- Local storage for session management

**Note**: This is just the frontend. You'll need a [backend api](https://github.com/MarkSemaan/cinema-booking-backend) to interact with.
