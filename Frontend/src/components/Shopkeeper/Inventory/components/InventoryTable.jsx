import React from 'react';
import { Tag, Calendar, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import Loading from '../../../../utils/Loading';

const InventoryTable = ({ loading, filteredInventory, formatDate, handleOpenEditModal, handleDelete }) => {
  return (
    <div className='bg-card/40 rounded border border-border/50 overflow-hidden overflow-x-auto'>
      <table className='w-full text-left text-sm'>
        <thead className='bg-secondary/50 text-muted-foreground uppercase text-xs'>
          <tr>
            <th className='p-4 font-semibold'>Item Name</th>
            <th className='p-4 font-semibold'>Category / Metal</th>
            <th className='p-4 font-semibold'>Quantity</th>
            <th className='p-4 font-semibold'>Total Weight</th>
            <th className='p-4 font-semibold'>Last Updated</th>
            <th className='p-4 font-semibold text-right'>Actions</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-border/50'>
          {loading ? (
            <tr>
              <td colSpan='6' className='p-8 text-center text-muted-foreground'>
                <Loading />
              </td>
            </tr>
          ) : filteredInventory.length === 0 ? (
            <tr>
              <td colSpan='6' className='p-12 text-center text-muted-foreground'>
                <Package className='w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400' />
                <p>No items found in your inventory.</p>
              </td>
            </tr>
          ) : (
            filteredInventory.map(item => {
              const isLowStock = item.quantity < 5;
              return (
                <tr key={item._id} className='hover:bg-secondary/20 transition-colors group'>
                  <td className='p-4 font-medium group-hover:text-amber-400 transition-colors'>
                    {item.jewelleryType}
                  </td>
                  <td className='p-4'>
                    <span className='capitalize inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary/50 text-xs border border-border/50'>
                      <Tag className='w-3 h-3 text-amber-400' />
                      {item.metalType}
                    </span>
                  </td>
                  <td className='p-4'>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded transition-all ${isLowStock ? 'bg-red-500/20 text-red-500 font-bold border border-red-500/20' : ''}`}>
                      {isLowStock && <AlertTriangle className='w-3 h-3' />}
                      {item.quantity} units
                    </span>
                  </td>
                  <td className='p-4'>{item.totalWeight}g</td>
                  <td className='p-4 text-muted-foreground'>
                    <div className='flex items-center gap-1.5'>
                      <Calendar className='w-3.5 h-3.5' /> {formatDate(item.updatedAt)}
                    </div>
                  </td>
                  <td className='p-4'>
                    <div className='flex items-center justify-end gap-3'>
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className='text-amber-400 p-1.5 hover:bg-amber-400/10 rounded transition-colors'
                        title="Edit Item"
                      >
                        <Edit className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className='text-red-400 hover:text-red-300 p-1.5 hover:bg-red-400/10 rounded transition-colors'
                        title="Delete Item"
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
