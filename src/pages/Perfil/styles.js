import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  width: 90%;
  max-width: 900px;
  margin: 50px auto;

  form {
    display: flex;
    flex-direction: column;
    margin-top: 30px;

    input {
      background: rgba(0, 0, 0, 0.3);
      border: 0;
      border-radius: 4px;
      height: 44px;
      padding: 0 15px;
      color: #fff;
      margin: 0 0 10px;

      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    span {
      color: #ffd700;
      align-self: flex-start;
      margin: 0 0 10px;
      font-weight: bold;
      font-size: 10px;
    }

    hr {
      border: 0;
      height: 1px;
      background: rgba(255, 255, 255, 0.2);
      margin: 10px 0 20px;
    }

    button {
      display: flex;
      align-items: center;
      justify-content: space-around;
      align-self: flex-end;

      border: 0;
      background: #f94d6a;
      border-radius: 4px;

      padding: 10px;
      margin: 5px 0 0;
      height: 36px;

      transition: background 0.2s;

      span {
        font-weight: bold;
        color: #fff;
        font-size: 14px;
        margin: 0 10px;
        align-self: center;
      }

      &:hover {
        background: ${darken(0.03, '#F94D6A')};
      }
    }
  }
`;
