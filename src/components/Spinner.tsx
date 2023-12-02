import { Circles } from 'react-loader-spinner'

export default function Spinner() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center">
      <Circles
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </section>
  )
}
