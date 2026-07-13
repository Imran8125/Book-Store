import React from 'react';
import Unavbar from './Unavbar';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

const Uhome = () => {
  const bestSellers = [
    {
      title: "RICH DAD POOR DAD",
      img: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1524451661i/39924789.jpg"
    },
    {
      title: "THINK AND GROW RICH",
      img: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1463241782i/30186948.jpg"
    },
    {
      title: "DON'T LET HER STAY",
      img: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1674147285i/80830635.jpg"
    },
    {
      title: "KILLING THE WITCHES",
      img: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1675642559i/65214203.jpg"
    }
  ];

  const recommendations = [
    {
      title: "HARRY POTTER",
      img: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1663805647i/136251.jpg"
    },
    {
      title: "ELON MUSK",
      img: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1692288251i/122765395.jpg"
    },
    {
      title: "THE MOSQUITO",
      img: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1544102229i/42983957.jpg"
    },
    {
      title: "JOURNEY ON THE JAMES",
      img: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1347493537i/1979210.jpg"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#130f0e] text-[#f5efe4]">
      <Unavbar />
      
      {/* Decorative glows */}
      <div className="absolute top-48 left-10 w-96 h-96 bg-[#d4af37]/3 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-96 right-10 w-[400px] h-[400px] bg-[#b24a3c]/3 rounded-full blur-[120px] pointer-events-none"></div>

      <Container className="py-12 flex-1 relative z-10">
        
        {/* Welcome Section */}
        <div className="mb-16 text-center lg:text-left animate-fade-in-up">
          <h2 className="text-4xl font-extrabold font-serif text-white tracking-tight">
            Discover Your Next <span className="text-gradient">Masterpiece</span>
          </h2>
          <p className="text-[#a69a8b] mt-2 max-w-xl">
            Browse our top-selling books and recommendations carefully selected for you.
          </p>
        </div>

        {/* Best Sellers Section */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/20">
              <FiTrendingUp className="text-[#d4af37] text-lg" />
            </div>
            <h3 className="text-2xl font-bold font-serif text-white tracking-tight m-0">Best Sellers</h3>
          </div>
          
          <Row xs={1} sm={2} md={4} className="g-4">
            {bestSellers.map((book, idx) => (
              <Col key={idx}>
                <Link to="/uproducts" className="no-underline">
                  <Card className="h-full glass-panel glass-card-hover group border border-[#342724] bg-[#211816]/30 overflow-hidden">
                    <div className="aspect-[2/3] overflow-hidden bg-[#0c0908] relative">
                      <Card.Img 
                        variant="top" 
                        src={book.img} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0908]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-xs font-semibold px-2.5 py-1 bg-[#d4af37] text-[#1a1311] rounded-full">View Details</span>
                      </div>
                    </div>
                    <Card.Body className="p-4 flex flex-col justify-between">
                      <Card.Title className="text-base font-bold font-serif text-white group-hover:text-[#d4af37] transition-colors text-center line-clamp-2">
                        {book.title}
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>

        {/* Top Recommendation Section */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#aa8417]/10 flex items-center justify-center border border-[#aa8417]/20">
              <FiCheckCircle className="text-[#c5a880] text-lg" />
            </div>
            <h3 className="text-2xl font-bold font-serif text-white tracking-tight m-0">Top Recommendations</h3>
          </div>
          
          <Row xs={1} sm={2} md={4} className="g-4">
            {recommendations.map((book, idx) => (
              <Col key={idx}>
                <Link to="/uproducts" className="no-underline">
                  <Card className="h-full glass-panel glass-card-hover group border border-[#342724] bg-[#211816]/30 overflow-hidden">
                    <div className="aspect-[2/3] overflow-hidden bg-[#0c0908] relative">
                      <Card.Img 
                        variant="top" 
                        src={book.img} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0908]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-xs font-semibold px-2.5 py-1 bg-[#c5a880] text-[#1a1311] rounded-full">View Details</span>
                      </div>
                    </div>
                    <Card.Body className="p-4 flex flex-col justify-between">
                      <Card.Title className="text-base font-bold font-serif text-white group-hover:text-[#c5a880] transition-colors text-center line-clamp-2">
                        {book.title}
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>

      </Container>
      <Footer />
    </div>
  );
};

export default Uhome;