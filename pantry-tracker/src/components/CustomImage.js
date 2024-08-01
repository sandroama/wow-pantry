import Image from 'next/image'
import imageLoader from '../utils/image-loader'

const CustomImage = ({ alt, ...props }) => {
  return <Image alt={alt || ''} loader={imageLoader} {...props} />
}

export default CustomImage