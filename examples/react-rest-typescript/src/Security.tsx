import React, { useState, useEffect } from 'react';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { Authenticator } from '@accounts/types';
import { accountsClient } from './accounts';

export const Security = () => {
  const [authenticators, setAuthenticators] = useState<Authenticator[]>([]);

  useEffect(() => {
    const fetchAuthenticators = async () => {
      const data = await accountsClient.authenticators();
      setAuthenticators(data);
      console.log(data);
    };

    fetchAuthenticators();
  }, []);

  return (
    <div>
      <h1>TWO-FACTOR AUTHENTICATION</h1>
      {authenticators.map(authenticator => {
        if (authenticator.type === 'otp') {
          return (
            <div key={authenticator.id}>
              <p>
                <FiberManualRecordIcon color="primary" /> Authenticator App
              </p>
              <p>Created at: {(authenticator as any).createdAt}</p>
              <p>Activated at: {authenticator.activatedAt}</p>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};
