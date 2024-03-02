interface Image {
  id: string;
  url: {
    fullSize: string;
    displaySize: string;
  },
  likes: number;
  views?: number;//API Doesn't return the views, only likes
  description: string;
  downloadUrl: string;
}

export default Image;
