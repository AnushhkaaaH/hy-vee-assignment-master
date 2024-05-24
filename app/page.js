"use client";
import React, { useState, useEffect } from 'react';
import countryNames from './countryData.js';

export default function Home() {
  const [name, setName] = useState('');
  const [nationalities, setNationalities] = useState([]);
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name) {
      try {
        setIsLoading(true);
        const [nationalizeResponse, genderizeResponse, agifyResponse] = await Promise.all([
          fetch(`https://api.nationalize.io?name=${name}`).then((res) => res.json()),
          fetch(`https://api.genderize.io?name=${name}`).then((res) => res.json()),
          fetch(`https://api.agify.io?name=${name}`).then((res) => res.json()),
        ]);

        const sortedNationalities = nationalizeResponse.country.sort((a, b) => b.probability - a.probability);

        setNationalities(
          sortedNationalities.map((entry) => ({
            ...entry,
            fullName: countryNames[entry.country_id] || entry.country_id,
          }))
        );

        setGender(genderizeResponse);
        setAge(agifyResponse);
        setShowForm(false);
      } catch (error) {
        console.error('API call error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const clearForm = () => {
    setName('');
    setNationalities([]);
    setGender(null);
    setAge(null);
    setShowForm(true);
  };

  const determineImage = () => {
    let newAge = age?.age;
    let newGender = gender?.gender;

    if (age && gender) {
      if (newAge >= 0 && newAge <= 25) {
        if (newGender === 'female') {
          return 'youngW.jpg';
        } else if (newGender === 'male') {
          return 'youngM.jpg';
        }
      } else if (newAge > 25 && newAge <= 50) {
        if (newGender === 'female') {
          return 'midW1.jpg';
        } else if (newGender === 'male') {
          return 'midM1.jpg';
        }
      } else if (newAge > 50 && newAge <= 100) {
        if (newGender === 'female') {
          return 'oldW1.jpg';
        } else if (newGender === 'male') {
          return 'oldM1.jpg';
        }
      }
    }
    return 'youngW.jpg';
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: 'url(25974.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black opacity-65 filter blur-md"></div>
      <div className="relative w-full max-w-md">
        {showForm ? (
          <div className="bg-white bg-opacity-65 p-8 rounded-lg shadow-md mb-4">
            <h1 className="text-2xl font-semibold mb-4 ml-24">Identity Identifier</h1>
            <form onSubmit={handleSubmit} className="mb-4 relative">
              <label className="block text-black-600 mb-2">
                Enter a name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border bg-slate-400 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                />
              </label>
              <div className="flex space-x-2 mt-4">
                <button type="submit" className="flex-1 bg-red-800 text-white py-2 px-4 rounded-md">
                  Submit
                </button>
              </div>
            </form>
            {isLoading && (
              <div className="text-center">
                <i className="fas fa-spinner fa-spin text-blue-500 text-2xl"></i> Loading...
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg bg-opacity-65 shadow-md">
            <img
              src={determineImage()}
              alt="User Image"
              className="w-36 h-48 border-2 border-black-200 rounded-md shadow-sm object-cover mx-auto mb-4"
            />
            <div>
              <h3 className="text-lg font-semibold">Nationality:</h3>
              <p className="text-gray-600 mb-2">
                <span>
                  <span className="font-bold">
                    {(nationalities[0].probability * 100).toFixed(2)}%
                  </span>{' '}
                  probability is that the user is from{' '}
                  <span className="font-bold">{nationalities[0].fullName}</span>.
                </span>
              </p>
            </div>
            {gender && (
              <div>
                <h3 className="text-lg font-semibold">Gender:</h3>
                <p className="text-gray-600 mb-2">{gender.gender === 'male' ? 'Male' : 'Female'}</p>
              </div>
            )}
            {age && (
              <div>
                <h3 className="text-lg font-semibold">Age:</h3>
                <p className="text-gray-600 mb-2">{age.age}</p>
              </div>
            )}
            <div className="flex space-x-2 mt-4">
              <button
                type="button"
                onClick={clearForm}
                className="flex-1 bg-amber-500 text-white py-2 px-4 rounded-md"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
