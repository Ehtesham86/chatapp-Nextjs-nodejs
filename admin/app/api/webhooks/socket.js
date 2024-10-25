// pages/api/saveMessage.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message } = req.body;

    // Save message to the 'receivedmessages' table
    const { data, error } = await supabase
      .from('receivedmessages')
      .insert([{ message }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ data });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
