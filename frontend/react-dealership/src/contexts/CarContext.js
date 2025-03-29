import { createContext, useContext, useState } from 'react';
import { carAPI } from '../services/api';

const CarContext = createContext();

export const useCarContext = () => useContext(CarContext);

export const CarProvider = ({ children }) => {
	const [cars, setCars] = useState([]);
	const [loading, setLoading] = useState(false);
	
	const fetchCars = async (params) => {
	try {
		setLoading(true);
		const response = await carAPI.getAllCars(params);
		setCars(response.data);
		return response.data;
	} catch (error) {
		console.error('Error fetching cars:', error);
		throw error;
	} finally {
		setLoading(false);
	}
	};
	
	return (
	<CarContext.Provider value={{ cars, loading, fetchCars }}>
		{children}
	</CarContext.Provider>
	);
};