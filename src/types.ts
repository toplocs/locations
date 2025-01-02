export interface Session {
  currentChallenge?: string;
  loggedInUserId?: string;
}

export interface User {
  username: string
  email: string
}

export interface Profile {
  username: string;
  type: string;
  image: string;
}

export interface Location {
  name: string;
  lat: number;
  lng: number;
}
