interface Props {
  message: string
}

export default function ErrorMessage({ message }: Props) {
  return (
    <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
      <p>{message}</p>
    </div>
  )
} 