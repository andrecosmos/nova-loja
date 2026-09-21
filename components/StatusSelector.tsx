'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

interface StatusSelectorProps {
  pedidoId: number
  statusAtual: string
}

export default function StatusSelector({ pedidoId, statusAtual }: StatusSelectorProps) {
  const [status, setStatus] = useState(statusAtual)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (novoStatus: string) => {
    setLoading(false)
    setStatus(novoStatus)

    try {
      const response = await fetch(`/api/pedidos/${pedidoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus })
      })

      if (!response.ok) throw new Error("Erro ao atualizar status.")
      
      router.refresh()
    } catch (error) {
      alert("Falha ao salvar a alteração de status.")
      setStatus(statusAtual) // Reseta pro anterior se falhar
    }
  }

  return (
    <select
      value={status}
      disabled={loading}
      onChange={(e) => handleStatusChange(e.target.value)}
      className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-700 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
    >
      <option value="PENDENTE">⏳ PENDENTE</option>
      <option value="PAGO">✅ PAGO</option>
      <option value="ENVIADO">🚚 ENVIADO</option>
      <option value="ENTREGUE">🎁 ENTREGUE</option>
      <option value="CANCELADO">❌ CANCELADO</option>
    </select>
  )
}
