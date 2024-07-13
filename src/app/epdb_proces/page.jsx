'use client'
import React, { useState } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import { Modal } from '@/components/modal/Modal';

export default function Home() {
  const [ligandFile, setLigandFile] = useState(null);
  const [receptorFile, setReceptorFile] = useState(null);
  const [nomeProces, setNomeProces] = useState('');
  const [nomeProcesSubmit, setNomeProcesSubmit] = useState('');
  const [gridsize, setGridsize] = useState('');
  const [gridcenter, setGridcenter] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [zipFile, setZipFile] = useState(null);
  const [dataOut, setDataOut] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); 

    const formData = new FormData();
    formData.append('ligand_file', ligandFile);
    formData.append('receptor_file', receptorFile);
    formData.append('nome_proces', nomeProces);
    formData.append('gridsize', gridsize);
    formData.append('gridcenter', gridcenter);

    try {
      const response = await axios.post('https://ttc-epdb-b.devapi.app.br/api/epdb/', formData, {
        responseType: 'blob', 
      });

      const zipBlob = response.data;
      const zip = await JSZip.loadAsync(zipBlob);
      const dataOutFile = await zip.file('data_out.json').async('string');
      const dataOutJson = JSON.parse(dataOutFile);
      setNomeProcesSubmit(nomeProces)
      setResponseMessage('Instância criada com sucesso!');
      setZipFile(URL.createObjectURL(zipBlob));
      setDataOut(dataOutJson);
      setIsModalOpen(true);
    } catch (error) {
      setResponseMessage('Erro ao criar a instância.');
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Upload de Arquivos</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nome do Processo</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              value={nomeProces}
              onChange={(e) => setNomeProces(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Arquivo Ligante</label>
            <input
              type="file"
              className="w-full"
              onChange={(e) => setLigandFile(e.target.files[0])}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Arquivo Receptor</label>
            <input
              type="file"
              className="w-full"
              onChange={(e) => setReceptorFile(e.target.files[0])}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Grid Size</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              value={gridsize}
              onChange={(e) => setGridsize(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Grid Center</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              value={gridcenter}
              onChange={(e) => setGridcenter(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
        {isLoading && (
          <div className="mt-4 text-center text-gray-700">Carregando...</div>
        )}
        {zipFile && (
          <button
            className="w-full mt-4 bg-blue-800 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            onClick={() => setIsModalOpen(true)}>
            Resultado
          </button>
        )}
        {responseMessage && (
          <div className="mt-4 text-center text-gray-700">{responseMessage}</div>
        )}
        {zipFile && (
          <div className="mt-4 text-center">
            <a
              href={zipFile}
              download={`${nomeProcesSubmit}.zip`}
              className="text-blue-500 hover:underline"
            >
              Baixar arquivo zip
            </a>
          </div>
        )}
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Binding Energy Results"
      >
        {dataOut && (
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Descrição</th>
                <th className="py-2 px-4 border-b">Valor</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(dataOut).map(([key, value]) => (
                <tr key={key}>
                  <td className="py-2 px-4 border-b">{key}</td>
                  <td className="py-2 px-4 border-b">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal>
    </div>
  );
}
