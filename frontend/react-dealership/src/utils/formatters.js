/**
 * Форматирует цену в рублях
 * @param {number} price - Цена для форматирования
 * @returns {string} Отформатированная цена
 */
export const formatPrice = (price) => {
	if (!price && price !== 0) return '';
	
	return new Intl.NumberFormat('ru-RU', {
	  style: 'currency',
	  currency: 'RUB',
	  maximumFractionDigits: 0
	}).format(price);
  };
  
  	/**
	 * Форматирует числа с разделителями
	 * @param {number} num - Число для форматирования
	 * @returns {string} Отформатированное число
	*/
  export const formatNumber = (num) => {
	if (!num && num !== 0) return '';
	
	return new Intl.NumberFormat('ru-RU').format(num);
  };