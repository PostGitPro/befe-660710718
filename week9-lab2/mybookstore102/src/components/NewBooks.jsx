import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import LoadingSpinner from './LoadingSpinner';

const NewBooks = () => {
  // กำหนด State สำหรับจัดการข้อมูล
  const [newBooks, setNewBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        // เรียก API เพื่อดึงข้อมูลหนังสือทั้งหมด
        const response = await fetch('/api/v1/books');

        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();

        // กรองเฉพาะหนังสือใหม่ (เพิ่มภายใน 30 วัน) และเรียงตามวันที่
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const recentBooks = data
          .filter(book => {
            if (book.created_at) {
              const bookDate = new Date(book.created_at);
              return bookDate >= thirtyDaysAgo;
            }
            return true; // ถ้าไม่มี created_at ให้แสดงด้วย
          })
          .sort((a, b) => {
            if (a.created_at && b.created_at) {
              return new Date(b.created_at) - new Date(a.created_at);
            }
            return 0;
          })
          .slice(0, 6); // แสดง 6 เล่ม

        setNewBooks(recentBooks);
        setError(null);
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching new books:', err);
        
      } finally {
        setLoading(false);
      }
    };

    // เรียกใช้ฟังก์ชันดึงข้อมูล
    fetchBooks();
  }, []); // [] = dependency array ว่าง = รันครั้งเดียว

  // กรณีกำลังโหลดข้อมูล
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  // กรณีเกิดข้อผิดพลาด
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-medium">⚠️ ไม่สามารถโหลดหนังสือใหม่ได้</p>
        <p className="text-red-500 text-sm mt-2">{error}</p>
      </div>
    );
  }

  // กรณีไม่มีหนังสือใหม่
  if (newBooks.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">📚 ยังไม่มีหนังสือใหม่ในขณะนี้</p>
      </div>
    );
  }

  // กรณีแสดงผลข้อมูลปกติ
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {newBooks.map(book => (
        <BookCard 
          key={book.id} 
          book={book}
          showNewBadge={true}
        />
      ))}
    </div>
  );
};

export default NewBooks;