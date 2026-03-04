-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'Prospecto',
  vehicle TEXT,
  score INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  year TEXT,
  km TEXT,
  price TEXT,
  status TEXT DEFAULT 'Disponível',
  img_src TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  sub_description TEXT,
  category TEXT,
  amount TEXT,
  type TEXT,
  status TEXT DEFAULT 'Compensado',
  date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, assuming authenticated or public access depending on the app)
CREATE POLICY "Allow public read access to customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to customers" ON public.customers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to customers" ON public.customers FOR DELETE USING (true);

CREATE POLICY "Allow public read access to vehicles" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to vehicles" ON public.vehicles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to vehicles" ON public.vehicles FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to vehicles" ON public.vehicles FOR DELETE USING (true);

CREATE POLICY "Allow public read access to transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to transactions" ON public.transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to transactions" ON public.transactions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to transactions" ON public.transactions FOR DELETE USING (true);
