export const actionSelect = [
      { value: "ADD", desc: "ADD" },
      { value: "DELETE", desc: "DELETE" },
      { value: "UPDATE", desc: "UPDATE" },
];
export const moduleSelect = [
      { value: "Accounts", desc: "Accounts" },
      { value: "Campus", desc: "Campus" },
      { value: "License", desc: "License" },
      { value: "Settings", desc: "Settings" },
];

export const minPaymenSelect = [
      { value: 1000, desc: "> 1,000.00" },
      { value: 5000, desc: "> 5,000.00" },
      { value: 10000, desc: "> 10,000.00" },
      { value: 20000, desc: "> 20,000.00" },
      { value: 500000, desc: "> 50,000.00" },
];

export const maxPaymenSelect = [
      { value: 1000, desc: "< 1,000.00" },
      { value: 5000, desc: "< 5,000.00" },
      { value: 10000, desc: "< 10,000.00" },
      { value: 20000, desc: "< 20,000.00" },
      { value: 500000, desc: "< 50,000.00" },
];

export const gradeSelect = [
      { value: 7, desc: "7" },
      { value: 8, desc: "8" },
      { value: 9, desc: "9" },
      { value: 10, desc: "10" },
      { value: 11, desc: "11" },
      { value: 12, desc: "12" },
];

export const roleSelect = [
      { value: 999, desc: "Admin" },
      { value: 30, desc: "School Representative" },
      { value: 10, desc: "Registrar" },
      { value: 5, desc: "Student" },
];

export const genderSelect = [
      { value: "M", desc: "Male" },
      { value: "F", desc: "Female" }
];

export const statusSelect = [
      { value: 1, desc: "Verified" },
      { value: 0, desc: "Not Verified" },
];

export const reportSelectStatus = [
      { value: 1, desc: "Resolved" },
      { value: 0, desc: "Pending" },
];

export const accessSelect = [
      { value: 5, desc: "USER ACCESS" },
      { value: 999, desc: "ADMIN ACCESS" }
];

export const yesnoSelect = [
      { value: 1, desc: "Yes" },
      { value: 0, desc: "No" },
];

export const colorSelect = [
      { value: "success", desc: "Green" },
      { value: "primary", desc: "Red" },
      { value: "warning", desc: "Yellow" },
      { value: "info", desc: "Blue" },
      { value: "dark", desc: "Dark" },
];

export const prioritySelect = [
      { value: 1, desc: "Normal" },
      { value: 2, desc: "Important" },
      { value: 3, desc: "Urgent" },
];

const currentYear = new Date().getFullYear();
export const years = Array.from({ length: currentYear - 1899 }, (_, index) => currentYear - index);

export const currentDate = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
  .toISOString()
  .split('T')[0];

    
export function isEmpty(obj) {
      if (obj === null || obj === undefined) return true;
    
      if (Array.isArray(obj) || typeof obj === 'string') {
            return obj.length === 0;
      }
    
      if (typeof obj === 'object') {
            return Object.keys(obj).length === 0;
      }
    
      return false;
};



/**
 * Formats a number into currency with commas and two decimal places.
 * @param {number|string} amount - The amount to format.
 * @returns {string} - The formatted currency string.
 */
export function formatCurrency(amount) {
      if (isNaN(amount)) return 0;
  
      return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'PHP', 
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
      }).format(amount);
}

export function getN(amount) {
      if (isNaN(amount) || amount === '') return '0'; 
      if (amount.startsWith('0') && amount.length > 1 && !amount.includes('.')) {
          return amount.slice(1);
      }
      return amount;
}
  