# haj-system
update the client with walking path from hotel to open door, Hotel admin will draw the path from hotel to all doors

## Features

### Shop Chat Location Sharing
The shop chat now includes a location sharing feature that allows buyers and sellers to share their current location with each other for easier meetups.

#### How to use:
1. Open a chat with a seller/buyer for any product
2. Click the location button (📍) next to the message input
3. Allow location access when prompted by your browser
4. Your location will be shared with the other user, including:
   - GPS coordinates
   - Human-readable address
   - Direct link to open the location in Google Maps

#### Features:
- **Real-time location sharing**: Get your current GPS coordinates
- **Address lookup**: Automatically converts coordinates to readable addresses
- **One-click navigation**: Direct link to open the location in Google Maps
- **Privacy-friendly**: Only shares location when you explicitly click the button
- **Error handling**: Graceful handling of location permission denials and timeouts

#### Technical details:
- Uses HTML5 Geolocation API for accurate positioning
- Reverse geocoding via OpenStreetMap Nominatim service
- Real-time messaging through Socket.IO
- Responsive design that works on mobile and desktop
- Automatic error messages for common location issues
