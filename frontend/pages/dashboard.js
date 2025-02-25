import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'

export default function Dashboard() {
  const [wallet, setWallet] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/wallet`, {
          headers: { 'x-auth-token': token },
        });
        setWallet(response.data);
      } catch (error) {
        console.error('Error fetching wallet:', error);
        router.push('/login');
      }
    };
    fetchWallet();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (!wallet) return <div>Loading...</div>

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant='h4'>Dashboard</Typography>
      <Typography>
        Welcome, {wallet.user.username}
      </Typography>
      <Typography>Balance: KES {wallet.balance}</Typography>
      <Button
        variant='contained'
        color='primary'
        onClick={() => router.push('/')}
        style={{ margin: '10px 0' }}
      >
        Fund Wallet
      </Button>
      <Button
        variant='outlined'
        color='secondary'
        onClick={handleLogout}
      >
        Logout
      </Button>

      <Typography
        variant='h6'
        style={{ marginTop: '20px' }}
      >
        Transaction History
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Amount (KES)</TableCell>
            <TableCell>Reference</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {wallet.transactions.map((tx, index) => (
            <TableRow key={index}>
              <TableCell>{tx.type}</TableCell>
              <TableCell>{tx.amount}</TableCell>
              <TableCell>{tx.reference}</TableCell>
              <TableCell>
                {new Date(tx.date).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
