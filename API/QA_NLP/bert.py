
import torch
from transformers import BertForQuestionAnswering
from flask import Flask, jsonify, request

model = BertForQuestionAnswering.from_pretrained('bert-large-uncased-whole-word-masking-finetuned-squad')

from transformers import BertTokenizer

tokenizer = BertTokenizer.from_pretrained('bert-large-uncased-whole-word-masking-finetuned-squad')



def answer_question(question):
    
    question = "what is cleanroom?"
    answer_text = "Clean room software engineering is a software development approach to producing quality software. It is different from classical software engineering as in classical software engineering QA (Quality Assurance) is the last phase of development that occurs at the completion of all development stages while there is a chance of less reliable and fewer quality products full of bugs, and errors and upset client, etc. But in clean room software engineering, an efficient and good quality software product is delivered to the client as QA (Quality Assurance) is performed each and every phase of software development.The cleanroom software engineering follows a quality approach to software development which follows a set of principles and practices for gathering requirements, designing, coding, testing, managing, etc. which not only improves the quality of the product but also increases productivity and reduces development cost. From the beginning of the system development to the completion of system development it emphasizes removing the dependency on the costly processes and preventing defects during development rather than removing the defects.The clean room approach was developed by Dr. Harlan Mills of IBM’s Federal Systems Division, and it was released in the year 1981 but got popularity after 1987 when IBM and other organizations started using it.The cleanroom is software development process intended to produce software with a certifiable level of reliability. The cleanroom process was originally developed by Harlan Mills and several of his colleagues including Alan Hevner at IBM.The focus of the cleanroom process is on defect prevention, rather than defect removal. The name cleanroom was chosen to evoke the cleanrooms used in the electronics industry to prevent the introduction of defects during the fabrication of semiconductors. The cleanroom process first saw use in the mid to late 1980s. Demonstration projects within the military began in the early 1990s."

    # Apply the tokenizer to the input text, treating them as a text-pair.
    input_ids = tokenizer.encode(question, answer_text)

    print('The input has a total of {:} tokens.'.format(len(input_ids)))

    """Just to see exactly what the tokenizer is doing, let's print out the tokens with their IDs."""

    # BERT only needs the token IDs, but for the purpose of inspecting the 
    # tokenizer's behavior, let's also get the token strings and display them.
    tokens = tokenizer.convert_ids_to_tokens(input_ids)

    # For each token and its id...
    for token, id in zip(tokens, input_ids):
        
        # If this is the [SEP] token, add some space around it to make it stand out.
        if id == tokenizer.sep_token_id:
            print('')
        
        # Print the token string and its ID in two columns.
        print('{:<12} {:>6,}'.format(token, id))

        if id == tokenizer.sep_token_id:
            print('')

    """We've concatenated the `question` and `answer_text` together, but BERT still needs a way to distinguish them. BERT has two special "Segment" embeddings, one for segment "A" and one for segment "B". Before the word embeddings go into the BERT layers, the segment A embedding needs to be added to the `question` tokens, and the segment B embedding needs to be added to each of the `answer_text` tokens. 

    These additions are handled for us by the `transformer` library, and all we need to do is specify a '0' or '1' for each token. 

    Note: In the `transformers` library, huggingface likes to call these `token_type_ids`, but I'm going with `segment_ids` since this seems clearer, and is consistent with the BERT paper.
    """

    # Search the input_ids for the first instance of the `[SEP]` token.
    sep_index = input_ids.index(tokenizer.sep_token_id)

    # The number of segment A tokens includes the [SEP] token istelf.
    num_seg_a = sep_index + 1

    # The remainder are segment B.
    num_seg_b = len(input_ids) - num_seg_a

    # Construct the list of 0s and 1s.
    segment_ids = [0]*num_seg_a + [1]*num_seg_b

    # There should be a segment_id for every input token.
    assert len(segment_ids) == len(input_ids)

    """>*Side Note: Where's the padding?*
    >
    > The original [example code](https://huggingface.co/transformers/model_doc/bert.html?highlight=bertforquestionanswering#transformers.BertForQuestionAnswering) does not perform any padding. I suspect that this is because we are only feeding in a *single example*. If we instead fed in a batch of examples, then we would need to pad or truncate all of the samples in the batch to a single length, and supply an attention mask to tell BERT to ignore the padding tokens.

    We're ready to feed our example into the model!

    Note: The result object is of type [QuestionAnsweringModelOutput](https://huggingface.co/transformers/main_classes/output.html#transformers.modeling_outputs.QuestionAnsweringModelOutput)
    """

    # Run our example through the model.
    outputs = model(torch.tensor([input_ids]), # The tokens representing our input text.
                                token_type_ids=torch.tensor([segment_ids]), # The segment IDs to differentiate question from answer_text
                                return_dict=True) 

    start_scores = outputs.start_logits
    end_scores = outputs.end_logits

    """Now we can highlight the answer just by looking at the most probable start and end words. """

    # Find the tokens with the highest `start` and `end` scores.
    answer_start = torch.argmax(start_scores)
    answer_end = torch.argmax(end_scores)

    # Combine the tokens in the answer and print it out.
    answer = ' '.join(tokens[answer_start:answer_end+1])

    print('Answer: "' + answer + '"')

    """It got it right! Awesome :)

    > *Side Note: It's a little naive to pick the highest scores for start and end--what if it predicts an end word that's before the start word?! The correct implementation is to pick the highest total score for which end >= start.*

    With a little more effort, we can reconstruct any words that got broken down into subwords.
    """

    # Start with the first token.
    answer = tokens[answer_start]

    # Select the remaining answer tokens and join them with whitespace.
    for i in range(answer_start + 1, answer_end + 1):
        
        # If it's a subword token, then recombine it with the previous token.
        if tokens[i][0:2] == '##':
            answer += tokens[i][2:]
        
        # Otherwise, add a space then the token.
        else:
            answer += ' ' + tokens[i]

    print('Answer: "' + answer + '"')

    return answer


app = Flask(__name__)


@app.route("/qas", methods=["post"])
# response
def response():
    # query = dict(request.form)['query']
    content = request.get_json()
    print(content)
    print(request)
    result = answer_question(content['question'])
    return jsonify({"answer": result})


if __name__ == "__main__":
    app.run(host="0.0.0.0")

# def hello(request):
#     result = answer_question(request.POST['data'])