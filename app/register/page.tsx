'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ocorreu um erro ao criar a conta.')
      }

      setSuccess(true)
      
      // Aguarda 2 segundos exibindo a mensagem de sucesso e joga para o login
      setTimeout(() => {
        router.push('/login')
      }, 2000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Crie sua Conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Cadastre-se para começar a fazer suas compras
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <p className="text-sm font-medium text-red-800 text-center">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4 border border-green-200">
            <p className="text-sm font-medium text-green-800 text-center">
              Conta criada com sucesso! Redirecionando...
            </p>
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                disabled={success}
                className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                Endereço de E-mail
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                disabled={success}
                className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="exemplo@loja.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Escolha uma Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={success}
                className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || success}
              className="group relative flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50"
            >
              {loading ? 'Processando...' : 'Cadastrar Conta'}
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Faça login aqui
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
