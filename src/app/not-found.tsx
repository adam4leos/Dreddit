import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='NotFound'>
      <h2 className='NotFound__title'>Page Not Found</h2>
      <Link href="/" className='NotFound__link'>Browse communities</Link>
    </div>
  )
}