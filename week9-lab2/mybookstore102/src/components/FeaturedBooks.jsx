import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import LoadingSpinner from './LoadingSpinner';

const FeaturedBooks = () => {
  // กำหนด State สำหรับจัดการข้อมูล
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        // เรียก API เพื่อดึงข้อมูลหนังสือ
        const response = await fetch('/api/v1/books');

        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();

        // กรองเฉพาะหนังสือที่มี rating สูง หรือหนังสือยอดนิยม
        const popularBooks = data
          .filter(book => book.rating >= 4.0 || book.reviews >= 50)
          .sort((a, b) => {
            // เรียงตาม rating และจำนวน reviews
            const scoreA = (a.rating || 0) * 0.7 + (a.reviews || 0) * 0.3;
            const scoreB = (b.rating || 0) * 0.7 + (b.reviews || 0) * 0.3;
            return scoreB - scoreA;
          })
          .slice(0, 6); // เลือก 6 เล่มที่ดีที่สุด

        // ถ้าไม่มีหนังสือที่ตรงเงื่อนไข ให้สุ่มแทน
        const selected = popularBooks.length > 0 
          ? popularBooks 
          : [...data].sort(() => 0.5 - Math.random()).slice(0, 6);

        setFeaturedBooks(selected);
        setError(null);
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching featured books:', err);
        
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
        <p className="text-red-600 font-medium">⚠️ ไม่สามารถโหลดหนังสือแนะนำได้</p>
        <p className="text-red-500 text-sm mt-2">{error}</p>
      </div>
    );
  }

  // กรณีไม่มีหนังสือ
  if (featuredBooks.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">📚 ยังไม่มีหนังสือแนะนำในขณะนี้</p>
      </div>
    );
  }

  // กรณีแสดงผลข้อมูลปกติ
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredBooks.map(book => (
        <BookCard 
          key={book.id} 
          book={book}
          showRating={true}
        />
      ))}
    </div>
  );
};

export default FeaturedBooks;