// src/utils/studentName.js
const KEY = 'scolia-student-name'
export const getStudentName = () => localStorage.getItem(KEY) || ''
export const setStudentName = (name) => localStorage.setItem(KEY, name.trim())
export const clearStudentName = () => localStorage.removeItem(KEY)
