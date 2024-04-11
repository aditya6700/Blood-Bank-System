import React from 'react'
import { Container, Row } from 'react-bootstrap';
import { developers } from '../utils/developers';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

export const About = () => {

  
  return (
    <>
      <Container fluid className='pt-5 d-flex flex-column bg-dark-subtle' style={{ height: '100vh', overflowY: 'hidden' }} >
        <Row>
          <h3 className="text-center fs-1 mb-3 text-capitalize">Developers</h3>
        </Row>
        <Row className=' mt-3'>
          <div className="slide-container mx-auto col-12 col-md-8">
            <div className="slide-content">
              <Swiper
               breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                  },
                }}
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination]}
                className="max-w-[90%] lg:max-w-[80%]" >
                {
                  developers.map((item) => {
                    return (
                      <SwiperSlide className='dev-card' key={item.name} >
                        <div className="image-content">
                          <span className="overlay"></span>
                          <div className="card-image">
                              <img src={item.img} alt="" className="card-img" />
                          </div>
                        </div>
                        <div className="card-content">
                          <h2 className="name">{item.name}</h2>
                          <p className="description">{item.about}</p>
                          <button className="button">View More</button>
                        </div>
                      </SwiperSlide>
                    )
                  })
                }
              </Swiper>
            </div>
          </div>
        </Row>
      </Container>
    </>
  )
}
