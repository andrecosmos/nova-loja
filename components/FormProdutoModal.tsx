'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Categoria {
  id: number
  nome: string
}

export default function FormProdutoModal({ categorias }: { categorias: Categoria[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [descricao, setDescricao] = useState('')
  const [imagem, setImagem] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!categoriaId) {
      setError('Por favor, selecione uma categoria.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          preco: Number(preco),
          categoriaId: Number(categoriaId),
          descricao,
          imagem: imagem || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao salvar o produto.')
      }

      // Sucesso: Reseta e fecha o modal
      setNome('')
      setPreco('')
      setCategoriaId('')
      setDescricao('')
      setImagem('')
      setIsOpen(false)
      
      // Atualiza os dados da página
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100"
      >
        + Novo Produto
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Cadastrar Novo Produto</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-sm">✕</button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-800 text-xs font-medium p-3 rounded-lg border border-red-200 mb-4 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSalvar} className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Nome do Produto</label>
                <input type="text" required value={nome} onChange={e => setNome(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="Ex: Camiseta Preta M" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Preço (R$)</label>
                  <input type="number" step="0.01" required value={preco} onChange={e => setPreco(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="99.90" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Categoria</label>
                  <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
                    <option value="">Selecione...</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">URL da Imagem</label>
                <input type="url" value={imagem} onChange={e => setImagem(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="https://linkdaimagem.com" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Descrição</label>
                <textarea rows={3} required value={descricao} onChange={e => setDescricao(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="Detalhes técnicos, material ou tamanhos..."></textarea>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="text-xs font-bold text-gray-500 hover:text-gray-700 px-4 py-2">Cancelar</button>
                <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg disabled:opacity-50 transition-colors">
                  {loading ? 'Salvando...' : 'Salvar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
