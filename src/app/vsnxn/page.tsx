'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button"

interface ReceptorFile {
  file: File | null;
  gridcenter: string;
  gridsize: string;
}

function VirtualScreeningForm() {
  const [nomeProces, setNomeProces] = useState<string>('');
  const [ligandSdfFile, setLigandSdfFile] = useState<File | null>(null);
  const [receptorFiles, setReceptorFiles] = useState<ReceptorFile[]>([]);

  const handleReceptorChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = event.target.files;
    if (files) {
      const newReceptorFiles = [...receptorFiles];
      newReceptorFiles[index] = {
        ...newReceptorFiles[index],
        file: files[0]
      };
      setReceptorFiles(newReceptorFiles);
    }
  };

  const handleAddReceptor = () => {
    setReceptorFiles([...receptorFiles, { file: null, gridcenter: '', gridsize: '' }]);
  };

  const handleRemoveReceptor = (index: number) => {
    setReceptorFiles(receptorFiles.filter((_, idx) => idx !== index));
  };

  const handleGridChange = (index: number, field: string, value: string) => {
    const newReceptorFiles = [...receptorFiles];
    newReceptorFiles[index] = {
      ...newReceptorFiles[index],
      [field]: value
    };
    setReceptorFiles(newReceptorFiles);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (ligandSdfFile) {
      const formData = new FormData();
      formData.append('nome_proces', nomeProces);
      formData.append('ligand_sdf_file', ligandSdfFile);

      receptorFiles.forEach((receptor, index) => {
        if (receptor.file) {
          formData.append(`receptor_files[${index}][file]`, receptor.file);
          formData.append(`receptor_files[${index}][gridcenter]`, receptor.gridcenter);
          formData.append(`receptor_files[${index}][gridsize]`, receptor.gridsize);
        }
      });

      const data = {
        nome_proces: nomeProces,
        ligand_sdf_file: ligandSdfFile,
        receptor_files: receptorFiles.map(receptor => ({
          file: receptor.file,
          gridcenter: receptor.gridcenter,
          gridsize: receptor.gridsize
        }))
      };

      try {
        const response = await axios.post('http://0.0.0.0:8000/api/virtualscreeningnxn/', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Success:', response.data);
      } catch (error: any) {
        console.error('Error posting data:', error.response?.data);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <input
            type="text"
            value={nomeProces}
            onChange={(e) => setNomeProces(e.target.value)}
            placeholder="Name of the docking process"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <input
            type="file"
            onChange={(e) => setLigandSdfFile(e.target.files ? e.target.files[0] : null)}
            accept=".sdf"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {receptorFiles.map((receptor, index) => (
          <div key={index} className="mb-4">
            <input
              type="file"
              onChange={(e) => handleReceptorChange(e, index)}
              accept=".pdb"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={receptor.gridcenter}
              onChange={(e) => handleGridChange(index, 'gridcenter', e.target.value)}
              placeholder="Grid Center"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={receptor.gridsize}
              onChange={(e) => handleGridChange(index, 'gridsize', e.target.value)}
              placeholder="Grid Size"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <Button onClick={() => handleRemoveReceptor(index)} className="mt-2 bg-red-500 text-white rounded hover:bg-red-700">
              Remove
            </Button>
          </div>
        ))}
        <Button onClick={handleAddReceptor} className="bg-blue-500 text-white rounded hover:bg-blue-700">
          Add Receptor
        </Button>
        <Button type="submit" className="bg-green-500 text-white rounded hover:bg-green-700">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default VirtualScreeningForm;
