export const PREPARED_PROMPT: string = `We are about to start playing Game of Life. Please generate random starting state and then iteration number. 

The format is starting state must be 0 and 1 matrix in markdown code block, where 0 means dead cell and 1 represents life cell. 
Matrix should have any number of columns between 20 and 40 and any number of rows between 20 and 40. Then comes single number number of iteration to generate between 1 and 100000. 

Don't use natural language.


output example: 
\`\`\`
01110010101
00110101001
00110101001
\`\`\`

Number of Iterations: 5000
`;
