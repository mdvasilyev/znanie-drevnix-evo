
my_dict = {'if': 'коли',
           'while': 'покуда'}

def parser(input_file, output_file, dictionary):
    with open(input_file, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    new_lines = []

    for line in lines:
        if line.startswith('#include') or line.startswith('using namespace'):
            continue

        words = line.split()
        for i in range(len(words)):
            word = words[i].strip('.,?!;:"\'()[]{}')
            if word in dictionary:
                words[i] = dictionary[word]

        new_lines.append(' '.join(words))

    must_have = '#include "../header/Ве_крест_крест.h"\n\nвнедрить хутор Русь;'
    new_lines.insert(0, must_have)
    output_text = '\n'.join(new_lines)

    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(output_text)

if __name__ == '__main__':
    parser('./test.cpp', './res.cpp', my_dict)
    