import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';
import { Book } from '../../data/books';
import { ConditionBadge } from '../ConditionBadge';

interface BookSpecsTableProps {
  book: Book;
}

export const BookSpecsTable: React.FC<BookSpecsTableProps> = ({ book }) => {
  return (
    <Paper sx={{ p: { xs: 2.25, sm: 3, md: 4 }, borderRadius: 3, border: '1px solid #D9E2EC', bgcolor: '#FFFFFF', height: '100%', boxShadow: '0 2px 10px rgba(15, 45, 74, 0.03)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <InfoIcon sx={{ color: '#1976D2' }} />
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F2D4A', fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
          ข้อมูลรายละเอียดหนังสือ
        </Typography>
      </Box>

      <TableContainer>
        <Table size="small" sx={{ '& .MuiTableCell-root': { px: { xs: 1, sm: 2 }, py: 1.1 } }}>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, width: { xs: '42%', sm: '35%' }, color: 'text.secondary', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>สำนักพิมพ์</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>{book.publisher || '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>ปีที่พิมพ์</TableCell>
              <TableCell>{book.publishedYear || '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>ISBN</TableCell>
              <TableCell>{book.isbn || '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>จำนวนหน้า</TableCell>
              <TableCell>{book.pages ? `${book.pages} หน้า` : '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>ภาษา</TableCell>
              <TableCell>{book.language || 'ไทย'}</TableCell>
            </TableRow>
            {book.edition && (
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>ฉบับ / พิมพ์ครั้งที่</TableCell>
                <TableCell>{book.edition}</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>สภาพโดยรวม</TableCell>
              <TableCell>
                <ConditionBadge condition={book.condition} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
