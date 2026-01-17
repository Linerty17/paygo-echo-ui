-- Create table for online payment uploads
CREATE TABLE public.payment_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  payment_type TEXT NOT NULL DEFAULT 'payid_online',
  amount NUMERIC NOT NULL DEFAULT 7200,
  screenshot_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.payment_uploads ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment uploads
CREATE POLICY "Users can view their own payment uploads" 
ON public.payment_uploads 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create their own payment uploads
CREATE POLICY "Users can create their own payment uploads" 
ON public.payment_uploads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_payment_uploads_updated_at
BEFORE UPDATE ON public.payment_uploads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-screenshots', 'payment-screenshots', true);

-- Storage policies for payment screenshots
CREATE POLICY "Users can upload payment screenshots" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'payment-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view payment screenshots" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'payment-screenshots');