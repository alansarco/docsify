export const actionSelect = [
      { value: "ADD", desc: "ADD" },
      { value: "DELETE", desc: "DELETE" },
      { value: "UPDATE", desc: "UPDATE" },
      { value: "UPLOAD", desc: "UPLOAD" },
];

export const moduleSelect = [
      { value: "Accounts", desc: "Accounts" },
      { value: "Campus", desc: "Campus" },
      { value: "License", desc: "License" },
      { value: "Documents", desc: "Documents" },
      { value: "Sections", desc: "Sections" },
      { value: "Programs", desc: "Programs" },
      { value: "Requests", desc: "Requests" },
      { value: "Settings", desc: "Settings" },
      { value: "Transferees", desc: "Transferees" },
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

export const analyticgradeSelect = [
      { value: 7, desc: "7" },
      { value: 8, desc: "8" },
      { value: 9, desc: "9" },
      { value: 10, desc: "10" },
      { value: 11, desc: "11" },
      { value: 12, desc: "12" },
      { value: 13, desc: "All Grade" },
];

export const analytictimeSelect = [
      { value: 1, desc: "Week" },
      { value: 2, desc: "Month" },
      { value: 3, desc: "Year" },
      { value: 4, desc: "Decade" },
];

export const roleSelect = [
      { value: 30, desc: "School Admin/Representative" },
      { value: 5, desc: "Student" },
];

export const genderSelect = [
      { value: "M", desc: "Male" },
      { value: "F", desc: "Female" }
];

export const statusSelect = [
      { value: 1, desc: "Active" },
      { value: 0, desc: "Inactive" },
];

export const activeSelect = [
      { value: 1, desc: "Active" },
      { value: 0, desc: "Inactive" },
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

export const assignedSelect = [
      { value: true, desc: "Yes" },
      { value: false, desc: "No" },
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

export const cardyears = Array.from({ length: 21 }, (_, index) => currentYear + index);

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

export function getNumber(amount) {
      if (isNaN(amount) || amount === '') return ''; 
      return amount;
}

export function getContact(number) {
      if (!number) return '';
  
      // Ensure it's a string
      number = String(number);
  
      // Remove non-digit characters
      number = number.replace(/\D/g, '');
  
      // Keep leading zero if it exists
      if (number.length > 11 && number.startsWith('0')) {
          return number.slice(0, 11);
      }
  
      // If it's already 11 or fewer digits, return as is
      return number;
  }

export function getLRN(amount) {
      // Prevent input if length is already 12
      if (amount.length > 12) {
          return amount.slice(0, 12); // Trim to 12 characters if exceeded
      }
      // Validate if it's not a number or empty
      if (isNaN(amount) || amount === '') {
          return '';
      }
      // Remove leading zero if it's not a decimal
      if (amount.startsWith('0') && amount.length > 1 && !amount.includes('.')) {
          return amount.slice(1);
      }
      return amount;
}

export function getCVV(number) {
      // Prevent input if length is already 12
      if (number.length > 3) {
          return number.slice(0, 3); // Trim to 12 characters if exceeded
      }
      // Validate if it's not a number or empty
      if (isNaN(number) || number === '') {
          return '';
      }
      return number;
}

export function getCardNumber(number) {
      // Prevent input if length is already 12
      if (number.length > 16) {
          return number.slice(0, 16); // Trim to 12 characters if exceeded
      }
      // Validate if it's not a number or empty
      if (isNaN(number) || number === '') {
          return '';
      }
      return number;
}

export function getCampusID(number) {
      // Prevent input if length is already 12
      if (number.length > 6) {
          return number.slice(0, 6); // Trim to 12 characters if exceeded
      }
      // Validate if it's not a number or empty
      if (isNaN(number) || number === '') {
          return '';
      }
      return number;
}

// export function getCardNumber(number) {
//       // Remove all non-digit characters
//       number = number.replace(/\D/g, '');
      
//       // Prevent input if length is already 16
//       if (number.length > 16) {
//           number = number.slice(0, 16); // Trim to 16 characters if exceeded
//       }
//       // Format the number by grouping every 4 digits with a dash
//       return number.replace(/(.{4})/g, '$1-').replace(/-$/, '');
// }
  

export const activeStatusSelect = [
      { value: 0, desc: "Pending" },
      { value: 1, desc: "On Queue" },
      { value: 2, desc: "Processing" },
      { value: 3, desc: "For Release" },
      { value: 7, desc: "On Hold" },
];

export const historyStatusSelect = [
      { value: 4, desc: "Completed" },
      { value: 5, desc: "Rejected" },
      { value: 6, desc: "Cancelled" },
];

export const requestStatusSelect = [
      { value: 0, desc: "Pending" },
      { value: 1, desc: "On Queue" },
      { value: 2, desc: "Processing" },
      { value: 3, desc: "For Release" },
      { value: 4, desc: "Completed" },
      { value: 5, desc: "Rejected" },
      { value: 6, desc: "Cancelled" },
      { value: 7, desc: "On Hold" },
];

export function getStatus(status) {
      if (status == 0) {
            return 'PENDING'
      }
      if (status == 1) {
            return 'ON QUEUE'
      }
      if (status == 2) {
            return 'PROCESSING'
      }
      if (status == 3) {
            return 'FOR RELEASE'
      }
      if (status == 4) {
            return 'COMPLETED'
      }
      if (status == 5) {
            return 'REJECTED'
      }
      if (status == 6) {
            return 'CANCELLED'
      }
      if (status == 7) {
            return 'ON HOLD'
      }
      return '';
}

export function getStatusColor(status) {
      if (status == 0) {
            return 'warning'
      }
      if (status == 1) {
            return 'success'
      }
      if (status == 2) {
            return 'info'
      }
      if (status == 3) {
            return 'dark'
      }
      if (status == 4) {
            return 'dark'
      }
      if (status == 5) {
            return 'primary'
      }
      if (status == 6) {
            return 'secondary'
      }
      if (status == 7) {
            return 'secondary'
      }
      return 'secondary';
}

export function getStatusBgColor(status) {
      if (status == 0) {
            return 'bg-warning'
      }
      if (status == 1) {
            return 'bg-success'
      }
      if (status == 2) {
            return 'bg-info'
      }
      if (status == 3) {
            return 'bg-dark'
      }
      if (status == 4) {
            return 'bg-purple'
      }
      if (status == 5) {
            return 'bg-primary'
      }
      if (status == 6) {
            return 'bg-secondary'
      }
      if (status == 7) {
            return 'bg-secondary'
      }
      return 'bg-secondary';
}

export function getStatusIcon(status) {
      if (status == 0) {
            return 'shopping_cart'
      }
      if (status == 1) {
            return 'pending'
      }
      if (status == 2) {
            return 'queue'
      }
      if (status == 3) {
            return 'inventory_2'
      }
      if (status == 4) {
            return 'check'
      }
      if (status == 5) {
            return 'close'
      }
      if (status == 6) {
            return 'close'
      }
      if (status == 7) {
            return 'warning'
      }
      return 'notifications';
}

export const monthSelect = [
      { value: 1, desc: "January" },
      { value: 2, desc: "February" },
      { value: 3, desc: "March" },
      { value: 4, desc: "April" },
      { value: 5, desc: "May" },
      { value: 6, desc: "June" },
      { value: 7, desc: "July" },
      { value: 8, desc: "August" },
      { value: 9, desc: "September" },
      { value: 10, desc: "October" },
      { value: 11, desc: "November" },
      { value: 12, desc: "December" },
];

export const subscriptionSelect = [
      { value: 31, desc: "1 month" },
      { value: 92, desc: "3 months" },
      { value: 183, desc: "6 months" },
      { value: 365, desc: "1 year" },
];

// export const validatePassword = () => {
//       const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).{8,}$/;
  
//       if (password.length < 8) return "Password must be at least 8 characters.";
//       if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
//       if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
//       if (!/\d/.test(password)) return "Password must contain at least one number.";
//       if (!passwordPattern.test(password)) return "Password must contain at least one special character.";
  
//       return ""; // No errors
//   };

export const validatePassword = () => {
      const rules = [
          "Password must be at least 8 characters",
          "Password must contain at least one uppercase letter",
          "Password must contain at least one lowercase letter",
          "Password must contain at least one number",
          "Password must contain at least one special character"
      ];
  
      return (
          <ul style={{ listStyleType: "none" }} className="ps-1">
              {rules.map((rule, index) => (
                  <li className="my-1" key={index}>{rule}</li>
              ))}
          </ul>
      );
  };
  
  