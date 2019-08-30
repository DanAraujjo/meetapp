import truncate from '../util/truncate';

import fetchUserAuthorization from '../util/fetchUserAuthorization';
import fileUpload from '../util/fileUpload';

describe('File', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Deve poder fazer upload de arquivo', async () => {
    const token = await fetchUserAuthorization();

    const file = await fileUpload(token);

    expect(file).toHaveProperty('url');
  });
});
