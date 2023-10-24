import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import { donorsListRoute } from '../../utils/ApiRoutes';
import { donorColumns } from '../../utils/tableHeaders/donorHeaders';
import { Container } from 'react-bootstrap';
import ReactTable from '../../components/ReactTable';

export const Donor = () => {

  const navigate = useNavigate();
  const [donorList, setDonorList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDonors = useCallback ( async () => {
    try {
      const res = await axios.get(donorsListRoute, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.data.success) {
        setDonorList(res.data.donors);
      }
    }
    catch (err) {
      console.log(err.response);
      if (!err.response.data.success) {
        navigate('/error');
      }
    }
    finally {
      setLoading(false);
    }
  }, [navigate])

  useEffect(() => {
    getDonors();
  }, [getDonors, navigate]);

 
  return (
    <Container className="h-100">
      {
        loading ? (
          <LoadingSpinner />
        ) : (
            <ReactTable
              title={'Donors ready to Tranfuse'}
              pageSize={8}
              data={donorList}
              columns={donorColumns}
            />
        )
      }
    </Container>
  );
};
