export default function imageLoader({ src, width, quality }) {
    if (src.startsWith('https://') || src.startsWith('http://')) {
      // For external URLs, return the URL as is
      return src;
    }
    // For internal images, use your custom logic (adjust as needed)
    return `https://your-internal-image-host.com/${src}?w=${width}&q=${quality || 75}`
  }