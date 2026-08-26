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
    <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #D9E2EC', bgcolor: '#FFFFFF', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <InfoIcon sx={{ color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          ข้อมูลรายละเอียดหนังสือ
        </Typography>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '35%', color: 'text.secondary' }}>สำนักพิมพ์</TableCell>
              <TableCell>{book.publisher || '-'}</TableCell>
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
