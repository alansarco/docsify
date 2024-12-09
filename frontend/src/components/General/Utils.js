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
    