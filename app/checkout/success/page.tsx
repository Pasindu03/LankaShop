import React, {Suspense} from 'react';
import CheckoutSuccessPage from "@/components/checkoutSuccess";

const Page = () => {
    return (
        <main>
          <Suspense fallback="loading" >
              <CheckoutSuccessPage />
          </Suspense>
        </main>
    );
};

export default Page;
