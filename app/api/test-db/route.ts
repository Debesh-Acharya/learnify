// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import Resource from '@/app/models/Resource';

export async function GET() {
  try {
    // Connect to the database
    await connectDB();
    
    // Count documents in collections
    const userCount = await User.countDocuments();
    const resourceCount = await Resource.countDocuments();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      data: {
        users: userCount,
        resources: resourceCount
      }
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { success: false, message: 'Database connection failed', error: String(error) },
      { status: 500 }
    );
  }
}
