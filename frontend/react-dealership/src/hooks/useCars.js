import { useState, useEffect } from 'react';
import { carAPI } from '../services/api';

export function useCars(params = {}) {
	const [cars, setCars] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
	useEffect(() => {
	async function fetchCars() {
		try {
		setLoading(true);
		const response = await carAPI.getAllCars(params);
		setCars(response.data);
		} catch (err) {
		setError(err.message);
		} finally {
		setLoading(false);
		}
	}
	
	fetchCars();
	}, [JSON.stringify(params)]);
	
	return { cars, loading, error };
}